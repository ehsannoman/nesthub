const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String, required: true, select: false },

    role: {
      type: String,
      enum: ['manager', 'resident', 'security', 'maintenance'],
      required: true,
    },
    buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },

    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    mustChangePassword: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lastLoginAt: { type: Date },
    tokenVersion: { type: Number, default: 0 },
    avatarUrl: { type: String },

    // Resident-only
    flat: { type: String, trim: true },
    ownershipType: { type: String, enum: ['Owner', 'Tenant'] },
    moveInDate: { type: Date },
    emergencyContact: {
      name: { type: String },
      phone: { type: String },
      relation: { type: String },
    },

    // Security/Maintenance-only
    employeeId: { type: String, trim: true },
    joiningDate: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.index({ email: 1, buildingId: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);