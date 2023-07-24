import { UserType } from 'server/models/Enums';
import { createAdmin, getAdminCount } from 'server/services/Admin.service';

export default async function installer() {
  const totalAdmins = await getAdminCount();
  if (totalAdmins > 0) {
    return;
  }

  await createAdmin({
    email: 'admin@app.com',
    password: 'admin',
    othernames: 'admin',
    surname: 'superadmin',
    type: UserType.Admin,
  });
}
