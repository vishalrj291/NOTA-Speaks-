require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Admin = require('./models/Admin')

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/notaspeaks')
  console.log('Connected to MongoDB')

  const email = process.env.ADMIN_EMAIL || 'admin@notaspeaks.org'
  const password = process.env.ADMIN_PASSWORD || 'NOTASpeaks@2025'

  const existing = await Admin.findOne({ email })
  if (existing) {
    console.log(`✅ Admin already exists: ${email}`)
    await mongoose.disconnect()
    return
  }

  const passwordHash = await bcrypt.hash(password, 12)
  await Admin.create({ email, passwordHash })

  console.log(`✅ Admin created successfully!`)
  console.log(`   Email: ${email}`)
  console.log(`   Password: ${password}`)
  console.log(`   ⚠️ Please change this password immediately after first login.`)

  await mongoose.disconnect()
}

seed().catch(err => { console.error(err); process.exit(1) })
