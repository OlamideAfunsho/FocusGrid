import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import logo from '../../public/images/landing_page_images/logo.svg'

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'What FocusGrid stores, where it is kept, and who can see it.',
}

const CONTACT_EMAIL = 'abolamide77@gmail.com'

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className='mt-10'>
    <h2 className='text-[20px] sm:text-[24px] font-semibold mb-3'>{title}</h2>
    <div className='text-[16px] sm:text-[18px] text-[#6C7278] leading-8 space-y-3'>{children}</div>
  </section>
)

const PrivacyPage = () => {
  return (
    <main className='min-h-dvh bg-white px-4 py-12 sm:p-12 lg:px-[120px] lg:py-16'>
      <div className='max-w-[760px] mx-auto'>
        <Link href='/' className='flex items-center gap-2 mb-10'>
          <Image src={logo} alt='FocusGrid Logo' />
          <span className='font-semibold text-[20px] sm:text-[24px] text-[#000000]'>FocusGrid</span>
        </Link>

        <h1 className='text-3xl sm:text-4xl font-bold mb-2'>
          Privacy at <span className='text-[#3399ff]'>FocusGrid</span>
        </h1>
        <p className='text-[14px] text-[#8F98A3]'>Last updated 29 September 2026</p>

        <Section title='What we store'>
          <p>
            When you sign up, we store your name, email address and profile picture from your
            sign-in provider. Everything else is what you create in the app: your courses,
            tasks and due dates, class notes, and the study sessions you complete with the timer.
          </p>
          <p>We do not ask for, or store, anything else about you.</p>
        </Section>

        <Section title='Your password'>
          <p>
            FocusGrid never sees or stores your password. Signing in is handled by Clerk, an
            authentication provider, whether you use an email address or your Google account.
          </p>
        </Section>

        <Section title='Where it is kept'>
          <p>
            Your data is stored in a hosted Supabase database. The app itself runs on Vercel.
            Both are third-party hosting providers, and your information is held on their
            servers under their security practices.
          </p>
        </Section>

        <Section title='Who can see it'>
          <p>
            Your courses, tasks, notes and study sessions are visible only to you when you are
            signed in. Other students using FocusGrid cannot see them.
          </p>
          <p>
            To be straightforward about it: as the person who maintains FocusGrid, I hold
            administrative access to the database, which is needed to fix problems and keep the
            app running. I do not read your content otherwise.
          </p>
        </Section>

        <Section title='What we do not do'>
          <p>
            We do not sell your data, share it with advertisers, or pass it to anyone outside the
            hosting providers above. FocusGrid carries no advertising and no third-party tracking
            or analytics scripts.
          </p>
        </Section>

        <Section title='Your choices'>
          <p>
            You can edit or delete any course, task or note at any time from your dashboard. If
            you want your account and everything in it removed, email{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className='text-[#3399ff] font-medium'>
              {CONTACT_EMAIL}
            </a>{' '}
            and it will be deleted.
          </p>
        </Section>

        <Section title='Questions'>
          <p>
            Anything you are unsure about, write to{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className='text-[#3399ff] font-medium'>
              {CONTACT_EMAIL}
            </a>
            . If this page changes, the date at the top will change with it.
          </p>
        </Section>

        <Link
          href='/'
          className='inline-block mt-12 p-3 px-6 text-[16px] text-white font-semibold rounded-[8px] shadow-[0px_7px_9.1px_0px_#C9C9FF9F] bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)]'
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}

export default PrivacyPage
