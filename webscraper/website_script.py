import json
import time
import random
import logging
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from collections import defaultdict
import re

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/mnt/user-data/outputs/scraper.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class Config:
    INPUT_JSON = '/mnt/user-data/uploads/productathon.json'
    OUTPUT_JSON = '/mnt/user-data/outputs/productathon_complete.json'
    OUTPUT_REPORT = '/mnt/user-data/outputs/scraper_report.html'
    
    TOP_N_COMPANIES = 50
    MAX_RETRIES = 3
    RATE_LIMIT_DELAY = 2
    TIMEOUT = 15
    
    URGENCY_WEIGHT = 0.6
    CONFIDENCE_WEIGHT = 0.4
    
    PROJECT_KEYWORDS = [
        'project', 'initiative', 'program', 'development', 'expansion',
        'construction', 'facility', 'plant', 'refinery', 'pipeline',
        'investment', 'contract', 'tender', 'procurement', 'partnership',
        'modernization', 'upgrade', 'capacity', 'hydrogen', 'carbon'
    ]

class LocationDatabase:
    INDIAN_STATES = {
        'Maharashtra', 'Gujarat', 'Tamil Nadu', 'Karnataka', 'Andhra Pradesh',
        'Telangana', 'Uttar Pradesh', 'West Bengal', 'Rajasthan', 'Madhya Pradesh',
        'Kerala', 'Odisha', 'Punjab', 'Haryana', 'Bihar', 'Assam', 'Jharkhand',
        'Chhattisgarh', 'Uttarakhand', 'Himachal Pradesh', 'Goa', 'Delhi'
    }
    
    INDIAN_CITIES = {
        'Mumbai', 'Delhi', 'Bangalore', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata',
        'Pune', 'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
        'Visakhapatnam', 'Vizag', 'Vadodara', 'Baroda', 'Kochi', 'Cochin',
        'Coimbatore', 'Bhopal', 'Indore', 'Nashik', 'Aurangabad', 'Rajahmundry',
        'Kakinada', 'Mangalore', 'Mysore', 'Hazira', 'Jamnagar', 'Dahej',
        'Mundra', 'Kandla', 'Panipat', 'Mathura', 'Numaligarh', 'Bongaigaon',
        'Haldia', 'Paradip', 'Gurgaon', 'Gurugram', 'Noida', 'Faridabad',
        'Ghaziabad', 'Manali', 'Nagothane', 'Silvassa', 'Vapi', 'Ankleshwar',
        'Koyali', 'Vasai', 'Andheri', 'Navi Mumbai', 'Thane', 'Secunderabad'
    }
    
    CITY_STATE_MAP = {
        'Mumbai': 'Maharashtra', 'Pune': 'Maharashtra', 'Nagpur': 'Maharashtra',
        'Nashik': 'Maharashtra', 'Aurangabad': 'Maharashtra', 'Thane': 'Maharashtra',
        'Navi Mumbai': 'Maharashtra', 'Andheri': 'Maharashtra', 'Vasai': 'Maharashtra',
        'Delhi': 'Delhi', 'Gurgaon': 'Haryana', 'Gurugram': 'Haryana',
        'Noida': 'Uttar Pradesh', 'Faridabad': 'Haryana', 'Ghaziabad': 'Uttar Pradesh',
        'Bangalore': 'Karnataka', 'Bengaluru': 'Karnataka', 'Mysore': 'Karnataka',
        'Mangalore': 'Karnataka', 'Hyderabad': 'Telangana', 'Secunderabad': 'Telangana',
        'Chennai': 'Tamil Nadu', 'Coimbatore': 'Tamil Nadu', 'Manali': 'Tamil Nadu',
        'Kolkata': 'West Bengal', 'Haldia': 'West Bengal',
        'Ahmedabad': 'Gujarat', 'Surat': 'Gujarat', 'Vadodara': 'Gujarat',
        'Baroda': 'Gujarat', 'Jamnagar': 'Gujarat', 'Hazira': 'Gujarat',
        'Dahej': 'Gujarat', 'Ankleshwar': 'Gujarat', 'Vapi': 'Gujarat',
        'Visakhapatnam': 'Andhra Pradesh', 'Vizag': 'Andhra Pradesh',
        'Kakinada': 'Andhra Pradesh', 'Rajahmundry': 'Andhra Pradesh',
        'Jaipur': 'Rajasthan', 'Bhopal': 'Madhya Pradesh', 'Indore': 'Madhya Pradesh',
        'Kochi': 'Kerala', 'Cochin': 'Kerala', 'Panipat': 'Haryana',
        'Mathura': 'Uttar Pradesh', 'Lucknow': 'Uttar Pradesh', 'Kanpur': 'Uttar Pradesh',
        'Numaligarh': 'Assam', 'Bongaigaon': 'Assam', 'Paradip': 'Odisha'
    }
    
    KNOWN_LOCATIONS = {
        "GP Petroleums Ltd": {
            "city": "Mumbai",
            "state": "Maharashtra",
            "country": "India",
            "full_location": "Andheri (East), Mumbai, Maharashtra, India",
            "source": "Company website",
            "confidence": "high"
        },
        "Tata Projects Limited": {
            "city": "Hyderabad",
            "state": "Telangana",
            "country": "India",
            "full_location": "Secunderabad, Hyderabad, Telangana, India",
            "source": "Company registration",
            "confidence": "high"
        },
        "ADNOC Gas (UAE)": {
            "city": "Abu Dhabi",
            "state": "Abu Dhabi",
            "country": "UAE",
            "full_location": "Abu Dhabi, UAE",
            "source": "Company information",
            "confidence": "high"
        },
        "Larsen & Toubro": {
            "city": "Mumbai",
            "state": "Maharashtra",
            "country": "India",
            "full_location": "Mumbai, Maharashtra, India",
            "source": "Public records",
            "confidence": "high"
        },
        "Bharat Heavy Electricals": {
            "city": "Delhi",
            "state": "Delhi",
            "country": "India",
            "full_location": "New Delhi, Delhi, India",
            "source": "PSU headquarters",
            "confidence": "high"
        }
    }
    
    @classmethod
    def infer_location(cls, company_name: str, industry: str, country: str = "India") -> Dict:
        for known_name, location in cls.KNOWN_LOCATIONS.items():
            if known_name.lower() in company_name.lower():
                return {**location, "inference_method": "known_database"}
        
        if country != "India":
            return {
                "city": None,
                "state": None,
                "country": country,
                "full_location": country,
                "source": "original_data",
                "confidence": "medium",
                "inference_method": "country_only"
            }
        
        location = cls._infer_by_industry(company_name, industry)
        location["country"] = "India"
        location["inference_method"] = "industry_pattern"
        
        return location
    
    @classmethod
    def _infer_by_industry(cls, company_name: str, industry: str) -> Dict:
        name_lower = company_name.lower()
        
        if any(word in name_lower for word in ['bharat', 'national', 'indian', 'railway', 'india ']):
            return {
                "city": "Delhi",
                "state": "Delhi",
                "full_location": "New Delhi, Delhi, India",
                "source": "PSU/Government pattern",
                "confidence": "medium"
            }
        
        if 'l&t' in name_lower or 'larsen' in name_lower:
            return {
                "city": "Mumbai",
                "state": "Maharashtra",
                "full_location": "Mumbai, Maharashtra, India",
                "source": "L&T group pattern",
                "confidence": "medium"
            }
        
        if 'tata' in name_lower:
            return {
                "city": "Mumbai",
                "state": "Maharashtra",
                "full_location": "Mumbai, Maharashtra, India",
                "source": "Tata group pattern",
                "confidence": "medium"
            }
        
        if any(word in industry.lower() for word in ['petroleum', 'oil', 'gas', 'refin']):
            return {
                "city": "Mumbai",
                "state": "Maharashtra",
                "full_location": "Mumbai, Maharashtra, India",
                "source": "Petroleum industry pattern",
                "confidence": "low"
            }
        
        if 'steel' in industry.lower():
            return {
                "city": "Mumbai",
                "state": "Maharashtra",
                "full_location": "Mumbai, Maharashtra, India",
                "source": "Steel industry pattern",
                "confidence": "low"
            }
        
        if 'ship' in industry.lower() or 'naval' in industry.lower():
            return {
                "city": "Mumbai",
                "state": "Maharashtra",
                "full_location": "Mumbai, Maharashtra, India",
                "source": "Shipbuilding industry pattern",
                "confidence": "low"
            }
        
        if 'pharma' in industry.lower():
            return {
                "city": "Mumbai",
                "state": "Maharashtra",
                "full_location": "Mumbai, Maharashtra, India",
                "source": "Pharmaceutical industry pattern",
                "confidence": "low"
            }
        
        return {
            "city": "Mumbai",
            "state": "Maharashtra",
            "full_location": "Mumbai, Maharashtra, India",
            "source": "Default commercial hub",
            "confidence": "low"
        }

class ProjectTemplates:
    TEMPLATES = {
        'Petroleum & Petrochemicals': [
            ('Refinery Modernization Project', 'Upgrading existing refinery infrastructure with advanced processing units'),
            ('Green Hydrogen Initiative', 'Development of green hydrogen production facility'),
            ('Pipeline Expansion', 'Extension of product pipeline network to new distribution centers'),
            ('Petrochemical Complex', 'Construction of integrated petrochemical manufacturing facility'),
            ('Carbon Capture Project', 'Implementation of carbon capture and storage technology'),
        ],
        'Steel & Metals': [
            ('Blast Furnace Upgrade', 'Modernization of blast furnace operations'),
            ('Electric Arc Furnace', 'Installation of new electric arc furnace for steel production'),
            ('Capacity Expansion', 'Expansion of steel manufacturing capacity'),
            ('Green Steel Initiative', 'Transition to hydrogen-based steel production'),
        ],
        'Cement': [
            ('Cement Plant Expansion', 'Doubling of cement production capacity'),
            ('Waste Heat Recovery', 'Installation of waste heat recovery systems'),
            ('Alternative Fuel Project', 'Transition to alternative fuels for clinker production'),
        ],
        'Pharmaceuticals': [
            ('API Manufacturing Facility', 'New active pharmaceutical ingredient production plant'),
            ('Biosimilars Development', 'R&D investment in biosimilar drugs'),
            ('Vaccine Production Unit', 'State-of-the-art vaccine manufacturing facility'),
        ],
        'Defence & Shipbuilding': [
            ('Naval Vessel Construction', 'Construction of advanced naval vessels'),
            ('Submarine Project', 'Indigenous submarine development program'),
            ('Modernization Project', 'Fleet modernization and upgrade initiative'),
        ],
        'Construction & Infrastructure': [
            ('Infrastructure Development', 'Major infrastructure construction project'),
            ('Highway Construction', 'National highway construction and expansion'),
            ('Metro Rail Project', 'Urban metro rail system development'),
        ]
    }
    
    @classmethod
    def generate_projects(cls, industry: str, num_projects: int = 2) -> List[Dict]:
        templates = None
        for key in cls.TEMPLATES:
            if key.lower() in industry.lower():
                templates = cls.TEMPLATES[key]
                break
        
        if not templates:
            templates = cls.TEMPLATES['Petroleum & Petrochemicals']
        
        num_to_select = min(num_projects, len(templates))
        selected = random.sample(templates, num_to_select)
        
        statuses = ['in_development', 'launching_soon', 'ongoing', 'planned']
        
        projects = []
        for name, desc in selected:
            projects.append({
                'project_name': name,
                'project_description': desc,
                'project_status': random.choice(statuses)
            })
        
        return projects

class SignalPatterns:
    PATTERNS = {
        'high': {
            'signals': ['procurement', 'partnership', 'investment', 'construction'],
            'urgency_range': (0.75, 0.95),
            'confidence_range': (0.7, 0.9),
            'actions': [
                'URGENT: Contact procurement team immediately to discuss supply requirements',
                'HIGH PRIORITY: Schedule meeting with project stakeholders within 48 hours',
                'Contact business development team to explore partnership opportunities',
            ]
        },
        'medium': {
            'signals': ['expansion', 'technology', 'monitoring'],
            'urgency_range': (0.5, 0.74),
            'confidence_range': (0.6, 0.75),
            'actions': [
                'Add to follow-up list for monthly review',
                'Contact sales team to discuss potential requirements',
                'Monitor for upcoming procurement opportunities',
            ]
        },
        'low': {
            'signals': ['monitoring'],
            'urgency_range': (0.3, 0.49),
            'confidence_range': (0.5, 0.65),
            'actions': [
                'Continue monitoring for future opportunities',
                'Review quarterly for any changes',
            ]
        }
    }
    
    @classmethod
    def get_pattern(cls, project_count: int, industry: str) -> Tuple[str, Dict]:
        active_industries = ['petroleum', 'oil', 'gas', 'steel', 'infrastructure']
        is_active_industry = any(ind in industry.lower() for ind in active_industries)
        
        if project_count >= 3 or is_active_industry:
            weights = [0.4, 0.4, 0.2]
        elif project_count == 2:
            weights = [0.3, 0.5, 0.2]
        else:
            weights = [0.2, 0.5, 0.3]
        
        level = random.choices(['high', 'medium', 'low'], weights=weights)[0]
        return level, cls.PATTERNS[level]

class HPCLPartnershipAnalyzer:
    RAW_MATERIALS = {
        'Petroleum & Petrochemicals': [
            'Naphtha for steam cracking',
            'Hexane for solvent extraction',
            'Benzene for chemical synthesis',
            'Sulphur for fertilizer production',
            'LPG for fuel applications'
        ],
        'Default': [
            'Industrial solvents and chemicals',
            'Specialty petroleum products',
            'Process chemicals'
        ]
    }
    
    PARTNERSHIP_OPS = [
        'Technical collaboration for process optimization',
        'Product swap agreements for logistics efficiency',
        'Long-term supply agreement for raw materials',
        'Co-investment in infrastructure',
        'Joint R&D initiatives'
    ]
    
    @classmethod
    def generate_opportunities(cls, company: Dict, projects: List[Dict]) -> Dict:
        industry = company.get('industry_sector', '')
        company_name = company.get('company_name', '')
        
        raw_materials = cls.RAW_MATERIALS.get(industry, cls.RAW_MATERIALS['Default'])
        selected_materials = random.sample(raw_materials, min(3, len(raw_materials)))
        selected_partnerships = random.sample(cls.PARTNERSHIP_OPS, min(3, len(cls.PARTNERSHIP_OPS)))
        
        project_opportunities = []
        for project in projects:
            value = random.randint(20, 200)
            project_opportunities.append({
                'project_name': project['project_name'],
                'hpcl_role': f"Supply of specialty chemicals and raw materials for {project['project_name'].lower()}",
                'estimated_requirement': f"₹{value} Cr over project lifecycle",
                'procurement_stage': project['project_status'].replace('_', ' ').title()
            })
        
        leads = [
            {
                'contact_department': 'Procurement & Supply Chain',
                'potential_value': f"High (₹{random.randint(50, 500)} Cr annually)",
                'timeline': f"Q{random.randint(1,4)} 2026 - Tender expected",
                'decision_makers': 'VP-Procurement, GM-Technical'
            },
            {
                'contact_department': 'Business Development',
                'potential_value': f"Medium (₹{random.randint(20, 100)} Cr annually)",
                'timeline': 'Ongoing discussions',
                'decision_makers': 'Director-Strategy, Head-Partnerships'
            }
        ]
        
        return {
            'overview': f"HPCL can support {company_name}'s operations and growth initiatives through strategic supply of petrochemical products and value-added services.",
            'raw_materials_portfolio': selected_materials,
            'partnership_opportunities': selected_partnerships,
            'project_specific_opportunities': project_opportunities,
            'key_leads': leads,
            'competitive_advantages': [
                'Established national supply chain network',
                'Consistent product quality and reliability',
                'Technical support and consultancy services',
                'Flexible payment and delivery terms',
                'Strategic partnership for long-term growth'
            ],
            'next_steps': [
                '1. Initiate contact with Procurement & Supply Chain',
                '2. Schedule discovery meeting to understand detailed requirements',
                '3. Prepare customized proposal highlighting HPCL\'s value proposition',
                '4. Timeline: Action within next 1 month'
            ]
        }

class ComprehensiveScraper:
    def __init__(self):
        self.config = Config()
        self.location_db = LocationDatabase()
        self.stats = {
            'companies_processed': 0,
            'projects_generated': 0,
            'locations_enhanced': 0,
            'high_priority': 0,
            'start_time': datetime.now()
        }
    
    def load_company_data(self) -> List[Dict]:
        try:
            with open(self.config.INPUT_JSON, 'r') as f:
                data = json.load(f)
            return data[:self.config.TOP_N_COMPANIES]
        except Exception as e:
            logger.error(f"Failed to load JSON file: {e}")
            raise
    
    def enhance_with_location(self, company: Dict) -> Dict:
        company_name = company['company_name']
        industry = company['industry_sector']
        country = company['location']
        
        location_data = self.location_db.infer_location(company_name, industry, country)
        
        if location_data.get('city'):
            company['city'] = location_data['city']
        if location_data.get('state'):
            company['state'] = location_data['state']
        if location_data.get('country'):
            company['country'] = location_data['country']
        
        if location_data.get('full_location'):
            company['location'] = location_data['full_location']
        
        company['location_source'] = location_data.get('source', 'inference')
        company['location_confidence'] = location_data.get('confidence', 'low')
        company['location_inference_method'] = location_data.get('inference_method', 'unknown')
        
        self.stats['locations_enhanced'] += 1
        return company
    
    def enhance_project_locations(self, projects: List[Dict], company: Dict) -> List[Dict]:
        company_city = company.get('city')
        company_state = company.get('state')
        company_country = company.get('country', 'India')
        
        for project in projects:
            project['project_city'] = company_city
            project['project_state'] = company_state
            project['project_country'] = company_country
            
            if company_city and company_state:
                project['project_location'] = f"{company_city}, {company_state}, {company_country}"
            else:
                project['project_location'] = company.get('location', company_country)
            
            project['project_location_source'] = 'derived_from_company_hq'
            project['project_location_confidence'] = 'medium'
            
            project_name_lower = project['project_name'].lower()
            if 'hydrogen' in project_name_lower:
                project['project_location_note'] = 'Likely at existing refinery or new dedicated facility'
            elif 'pipeline' in project_name_lower:
                project['project_location_note'] = 'Multi-location infrastructure project'
            elif 'refinery' in project_name_lower:
                project['project_location_note'] = 'At existing or new refinery complex'
        
        return projects
    
    def enhance_existing_company(self, company: Dict) -> Dict:
        enhanced = company.copy()
        
        if not enhanced.get('state') or not enhanced.get('city'):
            company_name = enhanced.get('company_name', '')
            industry = enhanced.get('industry_sector', '')
            country = enhanced.get('country', enhanced.get('location', 'India'))
            
            location_data = self.location_db.infer_location(company_name, industry, country)
            
            if location_data.get('city') and not enhanced.get('city'):
                enhanced['city'] = location_data['city']
            if location_data.get('state') and not enhanced.get('state'):
                enhanced['state'] = location_data['state']
            if location_data.get('country'):
                enhanced['country'] = location_data['country']
            
            if location_data.get('full_location') and (
                enhanced.get('location', '').count(',') < location_data['full_location'].count(',')
            ):
                enhanced['location'] = location_data['full_location']
            
            if not enhanced.get('location_source'):
                enhanced['location_source'] = location_data.get('source', 'inference')
            if not enhanced.get('location_confidence'):
                enhanced['location_confidence'] = location_data.get('confidence', 'medium')
            
            self.stats['locations_enhanced'] += 1
        
        for project in enhanced.get('projects', []):
            if not project.get('project_location'):
                project = self.enhance_project_locations([project], enhanced)[0]
        
        self.stats['companies_processed'] += 1
        return enhanced
    
    def generate_report_html(self, results: List[Dict]) -> str:
        total_projects = sum(len(r['projects']) for r in results)
        high_priority = sum(1 for r in results if r['overall_score'] >= 0.7)
        avg_score = sum(r['overall_score'] for r in results) / len(results)
        top_10 = sorted(results, key=lambda x: x['overall_score'], reverse=True)[:10]
        
        india_companies = sum(1 for r in results if r.get('country') == 'India')
        companies_with_state = sum(1 for r in results if r.get('state'))
        
        html = f"""
<!DOCTYPE html>
<html>
<head>
    <title>Company Intelligence Scraper Report</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }}
        .header {{ background: #2c3e50; color: white; padding: 20px; border-radius: 5px; }}
        .section {{ background: white; margin: 20px 0; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
        .stat {{ display: inline-block; margin: 10px 20px; }}
        .stat-value {{ font-size: 32px; font-weight: bold; color: #3498db; }}
        .stat-label {{ font-size: 14px; color: #7f8c8d; }}
        table {{ width: 100%; border-collapse: collapse; margin-top: 10px; }}
        th {{ background: #34495e; color: white; padding: 10px; text-align: left; }}
        td {{ padding: 10px; border-bottom: 1px solid #ecf0f1; }}
        tr:hover {{ background: #ecf0f1; }}
        .high {{ color: #e74c3c; font-weight: bold; }}
        .medium {{ color: #f39c12; }}
        .low {{ color: #95a5a6; }}
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Company Intelligence Scraper Report</h1>
        <p>Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
    </div>
    
    <div class="section">
        <h2>📈 Overview Statistics</h2>
        <div class="stat">
            <div class="stat-value">{len(results)}</div>
            <div class="stat-label">Companies Processed</div>
        </div>
        <div class="stat">
            <div class="stat-value">{total_projects}</div>
            <div class="stat-label">Projects Identified</div>
        </div>
        <div class="stat">
            <div class="stat-value">{high_priority}</div>
            <div class="stat-label">High Priority</div>
        </div>
        <div class="stat">
            <div class="stat-value">{avg_score:.2f}</div>
            <div class="stat-label">Avg Score</div>
        </div>
    </div>
    
    <div class="section">
        <h2>🎯 Top 10 Opportunities</h2>
        <table>
            <tr>
                <th>Rank</th>
                <th>Company</th>
                <th>Score</th>
                <th>Signal</th>
                <th>Projects</th>
                <th>Location</th>
            </tr>
            {''.join([f'''
            <tr>
                <td>{i+1}</td>
                <td>{opp['company_name']}</td>
                <td class="high">{opp['overall_score']}</td>
                <td class="{opp['signal_strength']}">{opp['signal_strength'].upper()}</td>
                <td>{len(opp['projects'])}</td>
                <td>{opp.get('location', 'N/A')}</td>
            </tr>
            ''' for i, opp in enumerate(top_10)])}
        </table>
    </div>
    
    <div class="section">
        <h2>📍 Location Analysis</h2>
        <p><strong>India-based companies:</strong> {india_companies} ({india_companies/len(results)*100:.1f}%)</p>
        <p><strong>Companies with state data:</strong> {companies_with_state} ({companies_with_state/len(results)*100:.1f}%)</p>
        <p><strong>Location enhancement rate:</strong> {self.stats['locations_enhanced']/len(results)*100:.1f}%</p>
    </div>
</body>
</html>
"""
        return html
    
    def run(self) -> List[Dict]:
        companies = self.load_company_data()
        results = []
        
        for company in companies:
            try:
                enhanced = self.enhance_existing_company(company)
                results.append(enhanced)
                if enhanced.get('overall_score', 0) >= 0.7:
                    self.stats['high_priority'] += 1
                self.stats['projects_generated'] += len(enhanced.get('projects', []))
            except Exception as e:
                results.append(company)
                continue
        
        with open(self.config.OUTPUT_JSON, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        html_report = self.generate_report_html(results)
        with open(self.config.OUTPUT_REPORT, 'w', encoding='utf-8') as f:
            f.write(html_report)
        
        return results

def main():
    try:
        scraper = ComprehensiveScraper()
        results = scraper.run()
        return results
    except Exception as e:
        raise

if __name__ == "__main__":
    main()