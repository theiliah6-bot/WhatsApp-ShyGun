const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');
const express = require('express');

// سرور کوچیک برای زنده نگه‌داشتن روی Render
const app = express();
app.get('/', (req, res) => res.send('Bot is alive'));
app.listen(process.env.PORT || 3000);

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('qr', qr => {
  console.log('کد QR رو اسکن کن:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => console.log('✅ ربات آماده است'));

// آیدی گروه‌هات رو اینجا بذار (بعداً نحوه پیدا کردنش رو توضیح می‌دم)
const groupIds = [
  'https://chat.whatsapp.com/LCvbowrcpVL3RIrPo7jz3z?s=cl&p=i&mlu=4&ilr=4',
];

// پیام‌هایی که می‌خوای بفرسته
const messages = [
  'خواهان فوری 🔴

خواهان زمین مشارکت در ساخت
فاز ۱ / ۲ / ۸ 
تعداد واحد
حتما با جواز قرارداد قطعی ✅

سازنده قوی / رزومه دار / باتجربه
کمیسیون شیرین برای بروکر ها

خریدار زمین فاز هشت 🔴
لطفا معرفی کنید 🫡

09335408545 ایلیا شایگان',
  'خواهان صددرصدی 🔴
  
  خواهان غیرتحویلی فاز هشت
    به قیمت باشه لطفا
      خرید قطعی 
        
امروز مبایعنامه✅
  تا ۵ تومن نهایتا
    
09335408545 ایلیا',
];

let index = 0;

cron.schedule('*/30 * * * *', async () => {
  const msg = messages[index % messages.length];
  for (const gid of groupIds) {
    try {
      await client.sendMessage(gid, msg);
      console.log(`ارسال شد به ${gid}`);
    } catch (e) {
      console.error(`خطا در ارسال به ${gid}:`, e.message);
    }
  }
  index++;
});

client.initialize();
