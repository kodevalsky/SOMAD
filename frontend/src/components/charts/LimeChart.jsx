import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LimeChart = ({ data }) => {
    const svgRef = useRef(null);

    useEffect(() => {
        if (!data || data.length === 0) return;

        const margin = { top: 20, right: 30, bottom: 40, left: 90 };
        const width = 500 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const g = svg
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // X axis
        const x = d3.scaleLinear()
            .domain([-1, 1]) // LIME scores usually range from -1 to 1 (or smaller)
            .range([0, width]);

        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("fill", "hsl(var(--muted-foreground))");

        // Y axis
        const y = d3.scaleBand()
            .range([0, height])
            .domain(data.map(d => d.word))
            .padding(0.1);

        g.append("g")
            .call(d3.axisLeft(y))
            .selectAll("text")
            .style("fill", "hsl(var(--foreground))");

        // Bars
        g.selectAll("myRect")
            .data(data)
            .join("rect")
            .attr("x", d => x(Math.min(0, d.score)))
            .attr("y", d => y(d.word))
            .attr("width", d => Math.abs(x(d.score) - x(0)))
            .attr("height", y.bandwidth())
            .attr("fill", d => d.score > 0 ? "hsl(142.1 76.2% 36.3%)" : "hsl(0 62.8% 30.6%)") // Green for positive, Red for negative
            .style("opacity", 0.8);

        // Zero line
        g.append("line")
            .attr("x1", x(0))
            .attr("x2", x(0))
            .attr("y1", 0)
            .attr("y2", height)
            .style("stroke", "hsl(var(--muted-foreground))")
            .style("stroke-dasharray", "4");

    }, [data]);

    return <svg ref={svgRef}></svg>;
};

export default LimeChart;
