// Liga o site ao projeto Firebase "corvus-codex".
// O Firebase vem direto do CDN do Google (sem npm). Por isso as páginas usam <script type="module">.
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

// Isto NÃO é segredo: só diz ao site qual projeto usar.
// Quem protege os dados são as regras do Firestore (arquivo firestore.rules).
const firebaseConfig = {
  apiKey: "AIzaSyAd-JmVLlZFTuEKeE3bHkAyVPH58vc5khU",
  authDomain: "corvus-codex.firebaseapp.com",
  projectId: "corvus-codex",
  storageBucket: "corvus-codex.firebasestorage.app",
  messagingSenderId: "1079931123711",
  appId: "1:1079931123711:web:b4ead7123204c5abe799ca"
};

const app = initializeApp(firebaseConfig);

// auth = contas (login com Google) | banco = Firestore (materiais e comentários)
export const auth = getAuth(app);
export const banco = getFirestore(app);
export const provedorGoogle = new GoogleAuthProvider();
