"use client"

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { LogIn ,  Share2, Sparkles, Users } from 'lucide-react'
import { Card, CardDescription } from '@/components/ui/card'
import Marquee from "react-fast-marquee";
export default function Home() {
  const [previewLink, setPreviewLink] = useState('')
  const [showPreviewLink, setShowPreviewLink] = useState(false)

  // Mock function to generate a preview link
  const generatePreviewLink = () => {
    setShowPreviewLink(true)
    const randomId = Math.random().toString(36).substring(2, 8)
    setPreviewLink(`anonova-pi.vercel.app/u/${randomId}`)
  }

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  }

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const cardFadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  }

    // Sample messages for the grid
  const sampleMessages = [
    { content: "Your app's UI is super intuitive! Maybe add a dark mode?", sender: "Anonymous User" },
    { content: "Loved the storyline in your novel draft. The pacing in chapter 3 could be tighter.", sender: "Anonymous Fan" },
    { content: "The color palette in your design is stunning! Consider bolder fonts.", sender: "Anonymous Designer" },
    { content: "Your code is clean, but error handling could be more robust.", sender: "Anonymous Developer" },
    { content: "Amazing artwork! The shadows add so much depth.", sender: "Anonymous Critic" },
    { content: "Your presentation was engaging, but the slides felt a bit crowded.", sender: "Anonymous Viewer" }
  ]

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col font-sans">
 
      {/* Hero Section */}
      <section className="flex-grow flex lg:h-screen items-center justify-center px-4 sm:px-6 lg:px-8 pt-32 pb-8 sm:py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white/80">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-5xl sm:text-6xl lg:text-8xl title-regular font-bold text-gray-900 mb-4 tracking-tight">
            Discover <span className="text-indigo-500 font-light italic">Anonova</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Create your own <span className="text-indigo-500 font-medium underline">unique link</span> and start receiving anonymous messages from anyone—friends, followers, or strangers.
          </p>
          <p className="mt-2 text-sm sm:text-base text-gray-500">
            Minimal. Secure. Insightful. Start your journey now.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row item-center justify-center gap-4">
            <Link href="/sign-up">
              <Button
                className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white text-base sm:text-lg font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Get Started
              </Button>
            </Link>
            <span>
            <Button
              variant="outline"
              onClick={generatePreviewLink}
              onBlur={() => setShowPreviewLink(false)}
              className="px-8 py-3 border-2 border-indigo-500 text-indigo-500 text-base sm:text-lg font-medium rounded-lg hover:bg-indigo-500 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Preview Link
            </Button>
            </span>
          </div>
          {showPreviewLink && previewLink && (
            <motion.div 
              className="mt-6 p-4 bg-white/70 backdrop-blur-md rounded-lg shadow-sm border border-gray-200"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-gray-600 text-sm">Your shareable link could look like:</p>
              <p className="text-indigo-500 font-medium text-sm sm:text-base break-all">{previewLink}</p>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:my-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <motion.div 
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          <h2 className="text-xl sm:text-3xl lg:text-4xl  font-bold text-gray-900 text-center mb-4 lg:mb-12">
            Here’s How the Magic Happens ✨
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Sign Up', desc: 'Create your account in seconds to get your unique Anonova link.',icon:LogIn },
              { title: 'Share', desc: 'Share your link via social media, chats, or email to collect messages.', icon:Share2 },
              // { title: 'Receive Messages', desc: 'Get anonymous messages from anyone who has your link.', icon:MessageCircle },
              { title: 'AI Prompts', desc: 'Use AI to generate creative messages.', icon:Sparkles },
              { title: 'Connect', desc: 'Receive anonymous feedback and messages from anyone, anywhere.', icon:Users }
            ].map((feature, index) => (
              
              <motion.div 
                key={index}
                className="p-6 lg:p-10 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                variants={cardFadeIn}
                whileHover={{ scale: 1.03 }}
              >
                <span className='flex gap-2'>
                <h3 className="text-lg font-semibold text-gray-800">{feature.title}</h3>
                <span className="inline-block mr-2">{feature.icon && <feature.icon className="w-4 h-4 inline-block" />}</span>
                </span>
                <p className="mt-2 text-gray-600 text-sm" key={index}>{feature.desc}</p>

              </motion.div> 
              

            ))}
          </div>
          
        </motion.div>
        
      </section>
      

      {/* Project Feedback Section */}
      <section className="lg:py-16 py-4 px-4 lg:my-16 mb-2 sm:px-6 lg:px-8 lg:h-[50vh] flex flex-col justify-center bg-gradient-to-b from-gray-50 to-white/80">
        <motion.div 
          className="max-w-8xl mx-auto text-center "
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Show. Share. Improve. <span className="text-indigo-500">Anonymously.</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Showcase your work and gather honest, anonymous feedback from your audience. Perfect for creators, developers, and innovators.
          </p>
          <div className="mt-8 space-y-4 ">
            {/* Upper Row: Left to Right */}
            <Marquee className="my-2" direction="left" speed={100} pauseOnHover>
              <div className="flex flex-wrap gap-4 ">
                {[...sampleMessages, ...sampleMessages].map((message, index) => (
                  <Card key={index} className="p-4">
                    <CardDescription className="text-sm text-gray-600 italic">"{message.content}"</CardDescription>
                    <p className="mt-2 text-xs text-indigo-500 font-medium text-right">— {message.sender}</p>
                  </Card>
                ))}
              </div>
            </Marquee>
            {/* Lower Row: Right to Left */}
            <Marquee className="my-2 lg:my-4" direction="right" speed={100} pauseOnHover>
              <div className="flex flex-wrap gap-4 ">
                {[...sampleMessages, ...sampleMessages].map((message, index) => (
                  <Card key={index} className=" p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
                    <CardDescription className="text-sm text-gray-600 italic">"{message.content}"</CardDescription>
                    <p className="mt-2 text-xs text-indigo-500 font-medium text-right">— {message.sender}</p>
                  </Card>
                ))}
              </div>
            </Marquee>
          </div>
        </motion.div>
      </section>


      {/* Call to Action Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 text-center bg-indigo-50/50">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-2xl sm:text-3xl  font-bold text-gray-900 mb-4">
            <span className='text-indigo-500'>Let’s</span> Get You Talking!
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            With just one link, you’re all set to receive anonymous messages, creative replies, and global vibes.
          </p>
          <Link href="/sign-up">
            <Button
              className="mt-8 px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white text-base sm:text-lg font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              Create Your Link
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-50/50 backdrop-blur-md py-8 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 text-sm font-medium">
            Cooked up with code & creativity by <Link href="https://twitter.com/khushramnani" className="text-indigo-500 font-semibold" target="_blank" rel="noopener noreferrer">@khushramnani</Link>
          </p>
        </div>
      </footer>
    </main>
  )
}