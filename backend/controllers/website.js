import Website from '../models/Website.js';

export const getWebsites = async (req, res) => {
  try {
    const { state, page = 1, limit = 50 } = req.query;
    
    const query = {};
    
    // Filter by state if provided
    if (state) {
      query.state = new RegExp(state, 'i');
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const websites = await Website.find(query)
      .sort({ overall_score: -1 }) // Sort by overall_score descending
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Website.countDocuments(query);

    res.status(200).json({
      success: true,
      data: websites,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get websites error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching websites' 
    });
  }
};

export const getWebsiteById = async (req, res) => {
  try {
    const { id } = req.params;
    const website = await Website.findOne({ company_id: id });

    if (!website) {
      return res.status(404).json({ 
        success: false, 
        message: 'Company not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: website
    });
  } catch (error) {
    console.error('Get website by ID error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching company' 
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const { state } = req.query;
    
    const query = state ? { state: new RegExp(state, 'i') } : {};

    const totalLeads = await Website.countDocuments(query);
    const highPriorityLeads = await Website.countDocuments({ 
      ...query, 
      signal_strength: 'high' 
    });
    
    const avgScore = await Website.aggregate([
      { $match: query },
      { $group: { _id: null, avgScore: { $avg: '$overall_score' } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalLeads,
        highPriorityLeads,
        averageScore: avgScore.length > 0 ? avgScore[0].avgScore : 0
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
