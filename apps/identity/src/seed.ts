import { prisma } from '@purhami/persistence';
import { PasswordService } from './application/services/PasswordService';

async function seed() {
  console.log('🌱 Seeding Admin User...');
  
  // تشفير كلمة المرور باستخدام الـ Service الخاص بك
  const { hash, salt } = await PasswordService.hash('SecurePass123!');

  const user = await prisma.user.upsert({
    where: { email: 'admin@purhami.com' },
    update: {},
    create: {
      email: 'admin@purhami.com',
      passwordHash: hash,
      salt: salt,
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'Purhami',
      isActive: true,
    },
  });

  console.log(`✅ Admin user created: ${user.email}`);
  console.log(`🔑 Password: SecurePass123!`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
