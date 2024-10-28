import React from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCurosal from './CategoryCurosal'
import LatestJobs from './LatestJobs'
import Footer from './shared/Footer'

const Home = () => {
  return (
    <div>
        <Navbar />
        <HeroSection />
        <CategoryCurosal />
        <LatestJobs />
        <Footer />
    </div>
  )
}

export default Home