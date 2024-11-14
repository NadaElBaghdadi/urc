import CryptoJS from 'crypto-js';

const hashPassword = (password) => {
  return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
};

export const registerUser = async ({ username, email, password }) => {
  console.log("Appel à l'API d'inscription avec", { username, email, password });

  const existingUser = await checkUserExists(username, email);
  console.log("Utilisateur existant ?", existingUser);

  if (existingUser) {
    throw new Error('L\'utilisateur ou l\'email est déjà utilisé.');
  }

  const hashedPassword = hashPassword(password);
  const externalId = crypto.randomUUID().toString();

  const newUser = {
    username,
    email,
    password: hashedPassword,
    external_id: externalId,
  };

  console.log("Nouvel utilisateur : ", newUser);

  saveUserToDatabase(newUser);  // Sauvegarde dans la base de données (dans ce cas, console log)

  return newUser;
};


const checkUserExists = async (username, email) => {
  const users = await getUsersFromDatabase();
  return users.some(user => user.username === username || user.email === email);
};

const getUsersFromDatabase = async () => {
  return [
    { username: 'existingUser', email: 'user@example.com' },
  ];
};

const saveUserToDatabase = async (user) => {
  console.log('Utilisateur enregistré :', user);
};
