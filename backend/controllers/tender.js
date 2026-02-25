import Tender from '../models/Tender.js';

export const getTenders = async (req, res) => {
  try {
    const { state, page = 1, limit = 50 } = req.query;
    
    const query = {};
    
    // Filter by state if provided
    if (state) {
      // Match state in location field (case-insensitive)
      query.location = new RegExp(state, 'i');
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tenders = await Tender.find(query)
      .sort({ overall_score: -1 }) // Sort by overall_score descending
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Tender.countDocuments(query);

    res.status(200).json({
      success: true,
      data: tenders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get tenders error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching tenders' 
    });
  }
};

export const getTenderById = async (req, res) => {
  try {
    const { id } = req.params;
    const tender = await Tender.findOne({ lead_id: id });

    if (!tender) {
      return res.status(404).json({ 
        success: false, 
        message: 'Tender not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: tender
    });
  } catch (error) {
    console.error('Get tender by ID error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching tender' 
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const { state } = req.query;
    
    const query = state ? { location: new RegExp(state, 'i') } : {};

    const totalLeads = await Tender.countDocuments(query);
    const highPriorityLeads = await Tender.countDocuments({ 
      ...query, 
      signal_strength: 'high' 
    });
    
    const avgScore = await Tender.aggregate([
      { $match: query },
      { $group: { _id: null, avgScore: { $avg: '$overall_score' } } }
    ]);

    const totalValue = await Tender.aggregate([
      { $match: query },
      { $group: { _id: null, totalValue: { $sum: '$estimated_value' } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalLeads,
        highPriorityLeads,
        averageScore: avgScore.length > 0 ? avgScore[0].avgScore : 0,
        totalValue: totalValue.length > 0 ? totalValue[0].totalValue : 0
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
