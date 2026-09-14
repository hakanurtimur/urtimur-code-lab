# Firebase Setup — Hakan Urtimur Code Lab

Kod tarafı hazır. Firebase'i gerçek hesabına bağlamak için yalnızca aşağıdakileri yap.

## 1. Firebase projesi

Firebase Console'da bir proje oluştur. Önerilen ad: `urtimur-code-lab`.

## 2. Web App

Project Settings → Your apps → Web App oluştur ve verilen config'i `.env.local` içine koy:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## 3. Authentication

Authentication → Sign-in method → **Email/Password** → Enable.

Öğrenci email görmeyecek. `ege_01` gibi kullanıcı adı sistem içinde otomatik `ege_01@students.urtimur.local` kimliğine çevrilir.

## 4. Firestore

Firestore Database oluştur. Sonra projedeki `firestore.rules` dosyasını yayınla:

```bash
npx firebase-tools login
npx firebase-tools deploy --only firestore:rules --project PROJE_ID
```

## 5. Firebase Admin

Project Settings → Service Accounts → **Generate new private key**.

İndirilen JSON'dan üç değeri `.env.local` içine ekle:

```env
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

JSON dosyasını repoya ekleme.

## 6. İlk öğretmen hesabı

Authentication → Users → Add user ile kendi email + şifreni oluştur.

Sonra terminalde:

```bash
npm run firebase:set-teacher -- seninmailin@example.com
```

## 7. Çalıştır

```bash
npm install
npm run dev
```

- Öğrenci login: `/login`
- Öğretmen login: `/teacher/login`
- Öğretmen paneli: `/teacher`

Öğrencileri artık Firebase Console'dan değil, `/teacher` içinden oluşturup yönetebilirsin. Her yeni öğrenci yalnızca Hafta 1 erişimiyle başlar; sonraki haftaları öğrenci kartındaki **Rota erişimi** alanından açarsın.

## 8. Vercel

`.env.local` içindeki 9 değeri Vercel → Project Settings → Environment Variables içine ekle ve redeploy et.

Bitti. Bundan sonra öğrenci ilerlemesi Firestore'da tutulur. Açık ders ekranındaki kod, aktif çalışma paneli, preview cihazı ve preview kaydırma konumu teacher paneline canlı akar. Teacher panelinde **Kod / Tarayıcı / Bölünmüş** görünümleri arasında geçebilirsin.

## Rules güncellemesi

Bu upgrade yeni canlı-preview alanları eklediği için mevcut projende rules dosyasını yeniden yayınla:

```bash
npx firebase-tools deploy --only firestore:rules --project urtimur-code-lab
```

## Presence, aşamalı ilerleme ve konu oyunları

Bu sürüm üç yeni Firestore akışı kullanır:

- `presence/{uid}`: öğrenci dashboard veya ders ekranındayken çevrim içi durumu
- `students/{uid}/progress/{lessonId}`: Practice → Challenge → Mini Build aşama ilerlemesi
- `students/{uid}/games/{gameId}`: konu oyunlarının deneme ve tamamlanma bilgisi

Upgrade sonrasında rules dosyasını yeniden yayınla:

```bash
npx firebase-tools deploy --only firestore:rules --project urtimur-code-lab
```

Öğretmen panelindeki **Dersi tamamlandı işaretle** butonu, öğrenci tarafındaki bir senkron problemi sırasında açık dersi güvenli şekilde tamamlamak için kurtarma aksiyonudur.
