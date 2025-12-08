import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const RadarChart = ({ data }) => {
    const svgRef = useRef(null);

    useEffect(() => {
        if (!data || Object.keys(data).length === 0) return;

        const margin = { top: 50, right: 50, bottom: 50, left: 50 };
        const width = 400 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
        const radius = Math.min(width, height) / 2;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous

        const g = svg
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${width / 2 + margin.left},${height / 2 + margin.top})`);

        const features = Object.keys(data);
        const angleSlice = (Math.PI * 2) / features.length;

        // Scale for the radius
        const rScale = d3.scaleLinear().range([0, radius]).domain([0, 1]);

        // Draw the axes (grid lines)
        const axisGrid = g.append("g").attr("class", "axisWrapper");

        // Levels
        const levels = 5;
        for (let i = 0; i < levels; i++) {
            const levelFactor = radius * ((i + 1) / levels);
            axisGrid.selectAll(".levels")
                .data([1]) // Dummy data
                .enter()
                .append("circle")
                .attr("r", levelFactor)
                .style("fill", "none")
                .style("stroke", "hsl(var(--muted-foreground))")
                .style("stroke-opacity", "0.3")
                .style("stroke-width", "0.5px");
        }

        // Axes
        const axis = axisGrid.selectAll(".axis")
            .data(features)
            .enter()
            .append("g")
            .attr("class", "axis");

        axis.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", (d, i) => rScale(1.1) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr("y2", (d, i) => rScale(1.1) * Math.sin(angleSlice * i - Math.PI / 2))
            .attr("class", "line")
            .style("stroke", "hsl(var(--muted-foreground))")
            .style("stroke-width", "1px");

        axis.append("text")
            .attr("class", "legend")
            .style("font-size", "12px")
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .attr("x", (d, i) => rScale(1.2) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr("y", (d, i) => rScale(1.2) * Math.sin(angleSlice * i - Math.PI / 2))
            .text(d => d)
            .style("fill", "hsl(var(--foreground))");

        // Draw the radar chart blob
        const radarLine = d3.lineRadial()
            .curve(d3.curveLinearClosed)
            .radius(d => rScale(d.value))
            .angle((d, i) => i * angleSlice);

        const dataValues = features.map(f => ({ axis: f, value: data[f] }));

        g.append("path")
            .datum(dataValues)
            .attr("d", radarLine)
            .style("stroke-width", 2)
            .style("stroke", "hsl(var(--primary))")
            .style("fill", "hsl(var(--primary))")
            .style("fill-opacity", 0.5);

    }, [data]);

    return <svg ref={svgRef}></svg>;
};

export default RadarChart;
