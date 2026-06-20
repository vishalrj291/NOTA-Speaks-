const router = require('express').Router()
const Campaign = require('../models/Campaign')
const auth = require('../middleware/auth')

// GET all campaigns (public)
router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ order: 1, createdAt: -1 })
    res.json(campaigns)
  } catch (e) { res.status(500).json({ message: 'Server error' }) }
})

// GET single campaign (public)
router.get('/:id', async (req, res) => {
  try {
    const c = await Campaign.findById(req.params.id) || await Campaign.findOne({ slug: req.params.id })
    if (!c) return res.status(404).json({ message: 'Campaign not found' })
    res.json(c)
  } catch { res.status(404).json({ message: 'Not found' }) }
})

// POST create campaign (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const campaign = await Campaign.create(req.body)
    res.status(201).json(campaign)
  } catch (e) { res.status(400).json({ message: e.message }) }
})

// PUT update campaign (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const c = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!c) return res.status(404).json({ message: 'Not found' })
    res.json(c)
  } catch (e) { res.status(400).json({ message: e.message }) }
})

// DELETE campaign (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Campaign.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch { res.status(500).json({ message: 'Server error' }) }
})

module.exports = router
