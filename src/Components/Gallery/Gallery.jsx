import React, { useState } from 'react'
import './Gallery.css'
import { FaCamera, FaLocationPin } from "react-icons/fa6";
import { BsImage, BsClock } from 'react-icons/bs';

// Importing your existing team logos for match context continuity
import Ng_Logo from '../../assets/NG_Boys_logo.png'
import BG_Logo from '../../assets/Best_Friends_logo.png'
import FB_Logo from '../../assets/Fire_Boys_logo.png'
import PB_Logo from '../../assets/Pepsi_logo.png'
import Rain_Logo from '../../assets/Rainbow_logo.png'
import SBCC_Logo from '../../assets/SBCC_logo.png'
import SB_Logo from '../../assets/Spark_Boys_logo.png'
import TSM_Logo from '../../assets/Top_Star_logo.png'
import VM_Logo from '../../assets/Vallarasu_Memorial_logo.png'
import Y11s_Logo from '../../assets/Youngs_11_logo.png'
import Kalai_Logo from '../../assets/Kalaipoonga_logo.png'
import LCC_Logo from '../../assets/LCC_logo.png'

const Gallery = () => {
    // Gallery categories tailored for local cricket tournaments
    const categories = ['Action', 'Celebrations', 'Teams', 'Matches'];

    // State to handle filtering by category
    const [activeCategory, setActiveCategory] = useState('All');

    // Sample data structure using placeholder high-quality cricket images
    const photosData = [
        {
            id: 1,
            imgUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=1000',
            category: 'Matches',
            matchName: 'NG Boys vs Best Friends',
            caption: 'The coin toss ceremony before the opening match.',
            date: 'March 1',
            time: '7:00 PM',
            Team_1: Ng_Logo,
            Team_2: BG_Logo,
            location: 'Murungapatti Aeri'
        },
        {
            id: 2,
            imgUrl: 'https://images.unsplash.com/photo-1624526261116-254e2e8fb726?auto=format&fit=crop&q=80&w=1000',
            category: 'Action',
            matchName: 'Fire Boys vs Pepsi Boys',
            caption: 'Spectacular diving save at the boundary rope.',
            date: 'March 2',
            time: '7:00 PM',
            Team_1: FB_Logo,
            Team_2: PB_Logo,
            location: 'Murungapatti Aeri'
        },
        {
            id: 3,
            imgUrl: 'https://images.unsplash.com/photo-1540747737956-37872404797a?auto=format&fit=crop&q=80&w=1000',
            category: 'Celebrations',
            matchName: 'Rainbow vs SBCC',
            caption: 'SBCC players celebrating a crucial wicket.',
            date: 'March 3',
            time: '7:00 PM',
            Team_1: Rain_Logo,
            Team_2: SBCC_Logo,
            location: 'Murungapatti Aeri'
        },
        {
            id: 4,
            imgUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1000',
            category: 'Action',
            matchName: 'Spark Boys vs Top Star',
            caption: 'Clean bowled! Spark Boys striker knocks the middle stump.',
            date: 'March 4',
            time: '7:00 PM',
            Team_1: SB_Logo,
            Team_2: TSM_Logo,
            location: 'Murungapatti Aeri'
        },
        {
            id: 5,
            imgUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=1000',
            category: 'Teams',
            matchName: 'Vallarasu Memorial vs Youngs 11',
            caption: 'Pre-match team lineup and briefing sessions.',
            date: 'March 5',
            time: '7:00 PM',
            Team_1: VM_Logo,
            Team_2: Y11s_Logo,
            location: 'Murungapatti Aeri'
        },
        {
            id: 6,
            imgUrl: 'https://images.unsplash.com/photo-1594470115555-d4bdf73de16a?auto=format&fit=crop&q=80&w=1000',
            category: 'Celebrations',
            matchName: 'Kalaipoonga vs LCC',
            caption: 'LCC lifting the final over triumph trophy.',
            date: 'March 6',
            time: '7:00 PM',
            Team_1: Kalai_Logo,
            Team_2: LCC_Logo,
            location: 'Murungapatti Aeri'
        }
    ];

    // Filtering logic
    const filteredPhotos = activeCategory === 'All'
        ? photosData
        : photosData.filter(photo => photo.category.toLowerCase() === activeCategory.toLowerCase());

    return (
        <div className='gallery'>
            {/* Standardized header matching the fixtures design */}
            <div className="gallery-heading">
                <h1>Match <span className="highlight">Photos</span></h1>
                <p>Browse through key highlights, moments, and actions captured on the field</p>
                <hr width="11.5%" color="#FFD54F" />
            </div>

            {/* Filter bar styled exactly like your original 'All-matches-dates' */}
            <div className="All-photos-categories">
                <div 
                    className={`all-categories-btn ${activeCategory === 'All' ? 'active-category' : ''}`}
                    onClick={() => setActiveCategory('All')}
                >
                    <p>ALL PHOTOS</p>
                </div>
                
                {categories.map((cat, index) => (
                    <div 
                        className={`category-item ${activeCategory === cat ? 'active-category' : ''}`} 
                        key={index}
                        onClick={() => setActiveCategory(cat)}
                    >
                        <p className="category-name">{cat}</p>
                    </div>
                ))}
                
                <div className="camera-icon">
                    <FaCamera size={30} color="#FFD54F" />
                </div>
            </div>

            {/* Title indicator bar */}
            <div className="gallery-tag">
                <BsImage size={20} color="#FFD54F" />
                <p>{activeCategory.toUpperCase()} CAPTURES</p>
            </div>

            {/* Main items display, layout structures preserved */}
            <div className="all-photos-list">
                {filteredPhotos.map((item) => (
                    <div className="photo-card" key={item.id}>
                        {/* Time details (matches date-detiles container layout) */}
                        <div className="photo-time-details">
                            <p><BsClock /> {item.time}</p>
                            <p>{item.date}</p>
                        </div>

                        {/* Middle display wrapper showcasing the photo and description */}
                        <div className="photo-showcase">
                            <img src={item.imgUrl} alt={item.matchName} className="main-shot" />
                            <div className="photo-caption-block">
                                <p className="match-title">{item.matchName}</p>
                                <p className="shot-caption">{item.caption}</p>
                            </div>
                        </div>

                        {/* Team logos present inside the card details */}
                        <div className="associated-teams">
                            <img src={item.Team_1} alt="Team 1 Logo" />
                            <p className="vs-tag">vs</p>
                            <img src={item.Team_2} alt="Team 2 Logo" />
                        </div>

                        {/* Location details (matches matches-pool container layout) */}
                        <div className="photo-pool-details">
                            <p><FaLocationPin /> {item.location}</p>
                            <p className="pool-tag">{item.category}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Gallery