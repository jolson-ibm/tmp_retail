// Sweater Inventory On Hand - Donut Chart
// Data sourced from: src/views/v_sweater_inventory_on_hand.sql
const sweaterInventoryData = [
    { item_code: '06403000010000201-XS', label: '1-XS', size: 'XS', total_on_hand: 9 },
    { item_code: '064030000100002002-S', label: '2-S', size: 'S', total_on_hand: 26 },
    { item_code: '064030000100002003-M', label: '3-M', size: 'M', total_on_hand: 75 },
    { item_code: '064030000100002004-L', label: '4-L', size: 'L', total_on_hand: 90 },
    { item_code: '06403000010000205-XL', label: '5-XL', size: 'XL', total_on_hand: 46 },
    { item_code: '0640300001000026-XXL', label: '6-XXL', size: 'XXL', total_on_hand: 14 }
];

// Chart dimensions
const donutWidth = 500;
const donutHeight = 500;
const donutMargin = 40;
const radius = Math.min(donutWidth, donutHeight) / 2 - donutMargin;
const innerRadius = radius * 0.55;

// Color scale
const colorScale = d3.scaleOrdinal()
    .domain(sweaterInventoryData.map(d => d.label))
    .range(['#1a73e8', '#34a853', '#fbbc04', '#ea4335', '#9334e6', '#ff6d01']);

// Create SVG container
const donutSvg = d3.select('#donut-chart')
    .append('svg')
    .attr('viewBox', `0 0 ${donutWidth} ${donutHeight}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('max-width', `${donutWidth}px`)
    .style('width', '100%')
    .append('g')
    .attr('transform', `translate(${donutWidth / 2}, ${donutHeight / 2})`);

// Create pie layout
const pie = d3.pie()
    .value(d => d.total_on_hand)
    .sort(null)
    .padAngle(0.02);

// Create arc generators
const arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(radius);

const hoverArc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(radius + 10);

const labelArc = d3.arc()
    .innerRadius(radius * 0.82)
    .outerRadius(radius * 0.82);

// Compute total for center label
const totalOnHand = d3.sum(sweaterInventoryData, d => d.total_on_hand);

// Create tooltip
const tooltip = d3.select('body')
    .append('div')
    .style('position', 'absolute')
    .style('background', 'rgba(0, 0, 0, 0.8)')
    .style('color', 'white')
    .style('padding', '8px 12px')
    .style('border-radius', '6px')
    .style('font-size', '13px')
    .style('pointer-events', 'none')
    .style('opacity', 0)
    .style('transition', 'opacity 0.2s ease');

// Draw arcs with animation
const arcs = donutSvg.selectAll('.arc')
    .data(pie(sweaterInventoryData))
    .enter()
    .append('g')
    .attr('class', 'arc');

arcs.append('path')
    .attr('fill', d => colorScale(d.data.label))
    .attr('stroke', 'white')
    .attr('stroke-width', 2)
    .style('cursor', 'pointer')
    .on('mouseover', function(event, d) {
        d3.select(this)
            .transition()
            .duration(200)
            .attr('d', hoverArc);
        const pct = ((d.data.total_on_hand / totalOnHand) * 100).toFixed(1);
        tooltip
            .html(`<strong>Size ${d.data.size}</strong><br/>On Hand: ${d.data.total_on_hand}<br/>${pct}% of total`)
            .style('left', (event.pageX + 12) + 'px')
            .style('top', (event.pageY - 10) + 'px')
            .style('opacity', 1);
    })
    .on('mousemove', function(event) {
        tooltip
            .style('left', (event.pageX + 12) + 'px')
            .style('top', (event.pageY - 10) + 'px');
    })
    .on('mouseout', function() {
        d3.select(this)
            .transition()
            .duration(200)
            .attr('d', arc);
        tooltip.style('opacity', 0);
    })
    .transition()
    .duration(800)
    .delay((d, i) => i * 120)
    .attrTween('d', function(d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t) {
            return arc(interpolate(t));
        };
    });

// Add size labels on slices
arcs.append('text')
    .attr('transform', d => `translate(${labelArc.centroid(d)})`)
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .style('font-size', '13px')
    .style('font-weight', '600')
    .style('fill', 'white')
    .style('pointer-events', 'none')
    .attr('opacity', 0)
    .text(d => d.data.size)
    .transition()
    .duration(400)
    .delay((d, i) => i * 120 + 600)
    .attr('opacity', 1);

// Center total label
donutSvg.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '-0.2em')
    .style('font-size', '32px')
    .style('font-weight', '700')
    .style('fill', '#333')
    .text(totalOnHand);

donutSvg.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '1.4em')
    .style('font-size', '13px')
    .style('fill', '#5f6368')
    .text('Total Units');

// Legend
const legend = d3.select('#donut-chart')
    .append('div')
    .style('display', 'flex')
    .style('flex-wrap', 'wrap')
    .style('justify-content', 'center')
    .style('gap', '12px')
    .style('margin-top', '16px');

sweaterInventoryData.forEach(d => {
    const item = legend.append('div')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('gap', '6px')
        .style('font-size', '13px')
        .style('color', '#5f6368');

    item.append('div')
        .style('width', '12px')
        .style('height', '12px')
        .style('border-radius', '3px')
        .style('background-color', colorScale(d.label));

    item.append('span')
        .text(`${d.size}: ${d.total_on_hand}`);
});
