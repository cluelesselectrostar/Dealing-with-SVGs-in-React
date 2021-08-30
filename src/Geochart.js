import React, { useRef, useEffect, useState } from "react";
import useResizeObserver from "./useResizeObserver";
import { select, geoPath, geoMercator, geoConicEquidistant, min, max, scaleLinear } from "d3";

function GeoChart({ data, coviddata, property }) {
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);
    const [selectedCountry, setSelectedCountry] = useState("");

    useEffect(() => {
        const svg = select(svgRef.current);

        // Declaraing colorscale
        const colorScale = [];

        // Use resized dimensions, but fall back to get bounding client rect if no dimensions yet
        const { width, height } =
            dimensions || wrapperRef.current.getBoundingClientRect();

        // Path generator from coordinates to border shapes on SVG
        const projection = geoMercator().fitSize(
            [width, height],
            selectedCountry || data);

        const pathGenerator = geoPath().projection(projection);

        // Create path element for every country in the world
        // CASE 1: From custom.geo.json
        if (property !== "total_cases") {

            // console.log(data.features)

            const minProp = min(data.features, feature => feature.properties[property]);
            const maxProp = max(data.features, feature => feature.properties[property]);

            // Input, then output
            const colorScale = scaleLinear()
                .domain([minProp, maxProp])
                .range(['#ccc', "teal"]);

            svg.selectAll(".country")
                .data(data.features)
                .join("path")
                .on("click", (e, feature) => {
                    setSelectedCountry(selectedCountry === feature ? null : feature);
                })
                .attr("class", "country")
                .transition() //zoom effect
                .duration(1000)
                .attr("fill", feature => colorScale(feature.properties[property]))
                .attr("d", feature => pathGenerator(feature));
            // render text
            svg
                .selectAll(".label")
                .data([selectedCountry])
                .join("text")
                .attr("class", "label")
                .text(
                    feature =>
                        feature &&
                        feature.properties.name +
                        ": " +
                        feature.properties[property].toLocaleString()
                )
                .attr("x", 10)
                .attr("y", 25);
        } else { // CASE 2: COVID DATA

            // NOTE: Merge data into copy of GEO JSON
            var cov_res = Object.entries(coviddata).map(([k, v]) => (
                { Label: k, Datum: v.data[v.data.length - 1].total_cases }
            ));
            //console.log("covidres")
            //console.log(cov_res);

            //console.log("data")
            //console.log(data);

            var copy = data;
            //console.log("copy")
            //console.log(copy);

            for (const i of Object.entries(copy.features)) {
                //console.log(i[1].properties.adm0_a3);
                var name = "";
                var num = -100;

                // TODO: LOOP THROUGH COVIDDATA
                for (const j of cov_res) {
                    name = j.Label;
                    if (name === i[1].properties.adm0_a3) {
                        //console.log(name)
                        if (j.Datum) {
                            num = j.Datum;
                        }
                        break;
                    }
                }

                i[1].properties.num = num;
                //console.log(i[1].properties.num)
            }
            //console.log(copy);

            const minProp = min(data.features, feature => feature.properties.num);
            const maxProp = max(data.features, feature => feature.properties.num);

            // Input, then output
            const colorScale = scaleLinear()
                .domain([minProp, maxProp])
                .range(['#ccc', "teal"]);
            svg.selectAll(".country")
                .data(data.features)
                .join("path")
                .on("click", (e, feature) => {
                    setSelectedCountry(selectedCountry === feature ? null : feature);
                })
                .attr("class", "country")
                .transition() //zoom effect
                .duration(1000)
                .attr("fill", feature => colorScale(feature.properties.num))
                .attr("d", feature => pathGenerator(feature));
            // render text
            svg
                .selectAll(".label")
                .data([selectedCountry])
                .join("text")
                .attr("class", "label")
                .text(
                    feature =>
                        feature &&
                        feature.properties.name +
                        ": " +
                        feature.properties.num.toLocaleString()
                )
                .attr("x", 10)
                .attr("y", 25);
            
        }

    }, [data, dimensions, property, selectedCountry]);

    return (
        <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
            <svg ref={svgRef}></svg>
        </div>
    )
}

export default GeoChart;