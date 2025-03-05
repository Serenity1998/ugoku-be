import admin from 'firebase-admin';
import { super_admins } from '../utils/userManager';

const authenticateUser = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    req.token = token;
    req.isSuperAdmin = super_admins.includes(decodedToken.email || '');
    if (req.isSuperAdmin && !req.query.callerId && !req.body.callerId && !req.path.includes('/admin/')) {
      return res.status(500).json({ message: 'Store ID is required' });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

export default authenticateUser;
