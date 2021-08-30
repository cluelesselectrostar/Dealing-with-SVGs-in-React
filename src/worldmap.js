import { useRef, useEffect, useState } from 'react';
import React from 'react';

import GeoChart from './Geochart';
import coviddata from './covid.json'
import data from './custom.geo.json';
import './worldmap.css';

function WorldMap() {
    // Default fallback to population
    const [property, setProperty] = useState("total_cases");
    const [date, setDate] = useState("2021-08-27");

    return (
        <React.Fragment>
            <h2>World Map with d3-geo</h2>
            <GeoChart data={data} coviddata={coviddata} property={property} date={date}/>
            <h2>Select property to highlight</h2>
            <select
                value={property}
                onChange={event => setProperty(event.target.value)}
            >
                {/* <option value="pop_est">Population</option>
                <option value="name_len">Name length</option>
                <option value="gdp_md_est">GDP</option> */}
                <option value="reproduction_rate">R Rate</option>
                <option value="new_cases">New Cases</option>
                <option value="new_cases_per_million">New Cases Per Million</option>
                <option value="total_cases">Total Cases</option>
                <option value="total_cases_per_million">Total Cases Per Million</option>
                <option value="new_deaths">New Deaths</option>
                <option value="new_deaths_per_million">New Deaths Per Million</option>
                <option value="total_cases">Total Deaths</option>
                <option value="total_deaths_per_million">Total Deaths Per Million</option>
                <option value="new_tests">New Tests</option>
                <option value="new_tests_per_thousand">New Tests Per Thousand</option>
                <option value="total_tests">Total Tests</option>
                <option value="total_tests_per_thousand">Total Tests Per Thousand</option>
                <option value="total_vaccinations">Total Vaccinations</option>
                <option value="total_vaccinations_per_hundred">Total Vaccinations Per Hundred</option>
                <option value="people_vaccinated">People Vaccinated</option>
                <option value="people_vaccinated_per_hundred">People Vaccinated Per Hundred</option>
                <option value="stringency_index">Stringency Index</option>


            </select>

            <br></br>

            <input
                type="date"
                id="start"
                name="trip-start"
                value={date}
                min="2020-01-01"
                max="2021-08-27"
                onChange={event => setDate(event.target.value)}
            ></input>
        </React.Fragment>
    );
}

export default WorldMap;
