import * as bcrypt from 'bcrypt';

export function encodePassword(password: string) {
  const SALT = bcrypt.genSaltSync();
  const hashedPassword = bcrypt.hashSync(password, SALT);
  return hashedPassword;
}

export function comparePass(password: string, hashPass: string) {
  return bcrypt.compareSync(password, hashPass);
}
