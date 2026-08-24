import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@dutakaryamembrane.com";
  const adminPassword =
    process.env.ADMIN_PASSWORD || "AdminDutaKarya123!";
  const adminName = process.env.ADMIN_NAME || "Administrator Duta Karya";

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: {
      email: adminEmail,
    },

    update: {
      password: hashedPassword,
      name: adminName,
      role: UserRole.ADMIN,
      active: true,
    },

    create: {
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: UserRole.ADMIN,
      active: true,
    },
  });

  console.log("========================================");
  console.log("ADMIN USER BERHASIL DIBUAT");
  console.log("========================================");
  console.log("ID       :", admin.id);
  console.log("Email    :", admin.email);
  console.log("Name     :", admin.name);
  console.log("Role     :", admin.role);
  console.log("Active   :", admin.active);
  console.log("========================================");
}

main()
  .catch((error) => {
    console.error("Gagal menjalankan seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });