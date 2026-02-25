import Tender from '../models/Tender.js';
import Website from '../models/Website.js';

export const getAllLeads = async (req, res) => {
  try {
    const { state, page = 1, limit = 50 } = req.query;
    
    // Build query based on state
    const tenderQuery = state ? { location: new RegExp(state, 'i') } : {};
    const websiteQuery = state ? { state: new RegExp(state, 'i') } : {};

    // Fetch both tenders and websites
    const tenders = await Tender.find(tenderQuery).lean();
    const websites = await Website.find(websiteQuery).lean();

    // Combine and normalize the data
    const allLeads = [
      ...tenders.map(tender => ({
        id: tender.lead_id,
        type: 'tender',
        company_name: tender.company_name,
        title: tender.title,
        description: tender.description,
        location: tender.location,
        overall_score: tender.overall_score,
        urgency_score: tender.urgency_score,
        confidence_score: tender.confidence_score,
        signal_strength: tender.signal_strength,
        deadline: tender.deadline,
        estimated_value: tender.estimated_value,
        industry_sector: tender.industry_sector,
        next_action: tender.next_action,
        source_url: tender.source_url,
        discovery_date: tender.discovery_date,
        products_recommended: tender.products_recommended,
        signals: tender.signals
      })),
      ...websites.map(website => ({
        id: website.company_id,
        type: 'website',
        company_name: website.company_name,
        title: `${website.company_name} - Business Opportunity`,
        description: website.hpcl_partnership_opportunities?.overview || 'Partnership opportunity',
        location: website.location,
        state: website.state,
        overall_score: website.overall_score,
        urgency_score: website.urgency_score,
        confidence_score: website.confidence_score,
        signal_strength: website.signal_strength,
        industry_sector: website.industry_sector,
        next_action: website.next_action,
        source_url: website.source_url,
        discovery_date: website.discovery_date,
        signals: website.signals,
        projects: website.projects
      }))
    ];

    // Sort by overall_score descending
    allLeads.sort((a, b) => (b.overall_score || 0) - (a.overall_score || 0));

    // Implement pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedLeads = allLeads.slice(skip, skip + parseInt(limit));

    res.status(200).json({
      success: true,
      data: paginatedLeads,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: allLeads.length,
        totalPages: Math.ceil(allLeads.length / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all leads error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching leads' 
    });
  }
};

export const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find in tenders first
    let lead = await Tender.findOne({ lead_id: id }).lean();
    let type = 'tender';
    
    // If not found in tenders, try websites
    if (!lead) {
      lead = await Website.findOne({ company_id: id }).lean();
      type = 'website';
    }

    if (!lead) {
      return res.status(404).json({ 
        success: false, 
        message: 'Lead not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...lead,
        type
      }
    });
  } catch (error) {
    console.error('Get lead by ID error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching lead' 
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const { state } = req.query;
    
    const tenderQuery = state ? { location: new RegExp(state, 'i') } : {};
    const websiteQuery = state ? { state: new RegExp(state, 'i') } : {};

    const tenderCount = await Tender.countDocuments(tenderQuery);
    const websiteCount = await Website.countDocuments(websiteQuery);
    const totalLeads = tenderCount + websiteCount;

    const highPriorityTenders = await Tender.countDocuments({ 
      ...tenderQuery, 
      signal_strength: 'high' 
    });
    const highPriorityWebsites = await Website.countDocuments({ 
      ...websiteQuery, 
      signal_strength: 'high' 
    });
    const highPriorityLeads = highPriorityTenders + highPriorityWebsites;

    const tenderValue = await Tender.aggregate([
      { $match: tenderQuery },
      { $group: { _id: null, totalValue: { $sum: '$estimated_value' } } }
    ]);

    const totalValue = tenderValue.length > 0 ? tenderValue[0].totalValue : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalLeads,
        tenderCount,
        websiteCount,
        highPriorityLeads,
        totalValue
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching dashboard stats' 
    });
  }
};
