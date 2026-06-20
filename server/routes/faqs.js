const router = require('express').Router()
const FAQ = require('../models/FAQ')
const auth = require('../middleware/auth')

router.get('/', async (req, res) => {
  try { res.json(await FAQ.find().sort({ order: 1, createdAt: 1 })) }
  catch { res.status(500).json({ message: 'Server error' }) }
})

router.post('/', auth, async (req, res) => {
  try { res.status(201).json(await FAQ.create(req.body)) }
  catch (e) { res.status(400).json({ message: e.message }) }
})

router.put('/:id', auth, async (req, res) => {
  try {
    const f = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!f) return res.status(404).json({ message: 'Not found' })
    res.json(f)
  } catch (e) { res.status(400).json({ message: e.message }) }
})

router.delete('/:id', auth, async (req, res) => {
  try { await FAQ.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }) }
  catch { res.status(500).json({ message: 'Server error' }) }
})

module.exports = router
