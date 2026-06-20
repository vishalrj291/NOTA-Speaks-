const { Schema, model } = require('mongoose')

const campaignSchema = new Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, sparse: true },
  description: { type: String, required: true },
  tag: { type: String, default: 'Active Campaign' },
  status: { type: String, enum: ['Active Campaign', 'Completed', 'Upcoming', 'Paused'], default: 'Active Campaign' },
  bannerUrl: { type: String, default: '' },
  gallery: [{ type: String }],
  stats: [{
    label: { type: String },
    value: { type: String },
  }],
  number: { type: String },
  color: { type: String, default: '#E8861A' },
  tagColor: { type: String, default: '#16a34a' },
  order: { type: Number, default: 0 },
}, { timestamps: true })

// Auto-generate slug
campaignSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }
  next()
})

module.exports = model('Campaign', campaignSchema)
