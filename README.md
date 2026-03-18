This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started 

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn more 

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel 

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


src/
  app/
    (site)/
      layout.js        // layout chính cho website
      page.js          // trang chủ
      products/
        page.js        // danh sách sản phẩm
        [id]/page.js   // chi tiết sản phẩm
      cart/
        page.js        // giỏ hàng
      checkout/
        page.js        // thanh toán
      profile/
        page.js        // tài khoản người dùng
    (admin)/
      admin/
        layout.js      // layout riêng cho admin
        page.js        // dashboard admin
        products/
          page.js      // quản lý sản phẩm
        orders/
          page.js      // quản lý đơn hàng
        users/
          page.js      // quản lý user
  components/
    ui/                // button, input, modal
    layout/            // navbar, footer
    product/           // card sản phẩm, filter
  lib/
    db.js              // cấu hình DB (Prisma/MySQL)
    utils.js           // hàm tiện ích
  styles/
    globals.css

