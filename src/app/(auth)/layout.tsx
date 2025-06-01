export const metadata = {
  title: 'Sign Up or Log In – Anonova',
  description: 'Access your Anonova dashboard to receive anonymous feedback, confessions, and messages. Sign up or log in to get your True Feedback.',
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
