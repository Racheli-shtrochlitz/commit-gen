# Commit Gen - AI-Powered Commit Message Generator

כלי CLI חכם ליצירת הצעות קומיטים על בסיס שינויים ב-Git.

## תכונות

- 🤖 ניתוח אוטומטי של Git diff
- 🎯 3 הצעות קומיטים מותאמות אישית
- 😊 אימוגי מתאימים לפי מוסכמות
- ⚡ מהיר וקל לשימוש
- 🔧 התקנה גלובלית

## התקנה

### התקנה גלובלית (מומלץ)
```bash
npm install -g commit-gen
```

### התקנה מקומית
```bash
git clone <repository-url>
cd commit-gen
npm install
npm run build
npm link  # להתקנה גלובלית מקומית
```

## שימוש

```bash
# בתוך רפוזיטורי Git
commit-gen

# או עם אפשרויות נוספות
commit-gen --verbose
commit-gen --model gpt-4
```

## הגדרה ראשונית

בפעם הראשונה, הכלי יבקש ממך להגדיר את ה-API key שלך.

### קבלת OpenAI API Key
1. לך ל-[OpenAI Platform](https://platform.openai.com/)
2. צור חשבון או התחבר
3. לך ל-API Keys
4. צור API Key חדש
5. העתק את המפתח

## דרישות

- Node.js 16+
- Git repository
- OpenAI API key

## עלויות ואבטחה

### 💰 עלויות OpenAI
- **תקופת ניסיון**: $5 אשראי חינמי
- **GPT-3.5 Turbo**: ~$0.002 לקומיט (מומלץ)
- **GPT-4**: ~$0.03 לקומיט (איכות גבוהה יותר)

### 🔒 אבטחה
- ✅ ה-API key נשמר רק על המחשב שלך
- ✅ הכלי בודק מידע רגיש לפני שליחה
- ✅ לא שולחים סיסמאות או מידע אישי
- ✅ רק קוד ה-Git diff נשלח ל-AI

### ⚠️ הגנות מובנות
- בדיקה אוטומטית למידע רגיש
- ניקוי אוטומטי של נתונים רגישים
- אזהרות למשתמש על מידע רגיש

## דוגמאות שימוש

```bash
# שימוש בסיסי
commit-gen

# עם פלט מפורט
commit-gen --verbose

# עם מודל GPT-4
commit-gen --model gpt-4

# עזרה
commit-gen --help
```

## פיתוח

```bash
# התקנת תלויות
npm install

# בנייה
npm run build

# פיתוח
npm run dev

# בדיקה מקומית
npm run build && node dist/index.js
```

## רישיון

MIT