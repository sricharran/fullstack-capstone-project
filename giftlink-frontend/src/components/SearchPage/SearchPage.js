import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { urlConfig } from '../../config';

function SearchPage() {

    // Task 1: State variables
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('');
    const [ageRange, setAgeRange] = useState(10);
    const [searchResults, setSearchResults] = useState([]);

    const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
    const conditions = ['New', 'Like New', 'Older'];

    const navigate = useNavigate();

    // Initial fetch
    useEffect(() => {
        fetchSearchResults();
    }, []);

    // Task 2: Fetch search results
    const fetchSearchResults = async () => {
        try {
            let url = `${urlConfig.backendUrl}/api/search?`;

            if (searchQuery) url += `name=${searchQuery}&`;
            if (selectedCategory) url += `category=${selectedCategory}&`;
            if (selectedCondition) url += `condition=${selectedCondition}&`;
            if (ageRange) url += `age_years=${ageRange}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const data = await response.json();
            setSearchResults(data);

        } catch (error) {
            console.log('Fetch error:', error.message);
        }
    };

    // Task 6: Navigate
    const goToDetailsPage = (productId) => {
        navigate(`/details/${productId}`);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">

                    <div className="filter-section mb-3 p-3 border rounded">
                        <h5>Filters</h5>

                        <div className="d-flex flex-column">

                            {/* Task 3: Category dropdown */}
                            <select
                                className="form-control mb-2"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat, index) => (
                                    <option key={index} value={cat}>{cat}</option>
                                ))}
                            </select>

                            {/* Condition dropdown */}
                            <select
                                className="form-control mb-2"
                                value={selectedCondition}
                                onChange={(e) => setSelectedCondition(e.target.value)}
                            >
                                <option value="">All Conditions</option>
                                {conditions.map((cond, index) => (
                                    <option key={index} value={cond}>{cond}</option>
                                ))}
                            </select>

                            {/* Task 4: Age slider */}
                            <label>Max Age: {ageRange} years</label>
                            <input
                                type="range"
                                min="0"
                                max="20"
                                value={ageRange}
                                onChange={(e) => setAgeRange(e.target.value)}
                            />

                        </div>
                    </div>

                    {/* Task 7: Search input */}
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Search gifts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    {/* Task 8: Search button */}
                    <button
                        className="btn btn-primary mb-3"
                        onClick={fetchSearchResults}
                    >
                        Search
                    </button>

                    {/* Task 5: Display results */}
                    {searchResults.length === 0 ? (
                        <p>No results found</p>
                    ) : (
                        searchResults.map((gift) => (
                            <div key={gift.id} className="card mb-3 p-3">
                                <h5>{gift.name}</h5>
                                <p>{gift.category} | {gift.condition}</p>

                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => goToDetailsPage(gift.id)}
                                >
                                    View Details
                                </button>
                            </div>
                        ))
                    )}

                </div>
            </div>
        </div>
    );
}

export default SearchPage;