const router = require('express').Router()
const TeamMember = require('../models/TeamMember')
const auth = require('../middleware/auth')

router.get('/', async (req, res) => {
  try { res.json(await TeamMember.find().sort({ order: 1, createdAt: 1 })) }
  catch { res.status(500).json({ message: 'Server error' }) }
})

router.post('/', auth, async (req, res) => {
  try { res.status(201).json(await TeamMember.create(req.body)) }
  catch (e) { res.status(400).json({ message: e.message }) }
})

router.put('/:id', auth, async (req, res) => {
  try {
    const m = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!m) return res.status(404).json({ message: 'Not found' })
    res.json(m)
  } catch (e) { res.status(400).json({ message: e.message }) }
})

router.delete('/:id', auth, async (req, res) => {
  try { await TeamMember.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }) }
  catch { res.status(500).json({ message: 'Server error' }) }
})

module.exports = router
