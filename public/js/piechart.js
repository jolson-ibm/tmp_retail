// Sweater Inventory On Hand - Pie Chart (Chart.js)
// Data sourced from: src/views/v_sweater_inventory_on_hand.sql
// Replaces: public/js/donutchart.js (D3 donut chart)

const sweaterLabels = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const sweaterData = [9, 26, 75, 90, 46, 14];
const sweaterColors = ['#534AB7', '#0F6E56', '#378ADD', '#639922', '#D85A30', '#D4537E'];
const sweaterTotal = sweaterData.reduce((a, b) => a + b, 0);

// Find top and low stock sizes
const maxIdx = sweaterData.indexOf(Math.max(...sweaterData));
const minIdx = sweaterData.indexOf(Math.min(...sweaterData));

// Build metric cards
const metricsContainer = document.createElement('div');
metricsContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 20px;';

const metrics = [
    { label: 'Total on hand', value: sweaterTotal },
    { label: 'Top size', value: sweaterLabels[maxIdx] + ' (' + sweaterData[maxIdx] + ')' },
    { label: 'Low stock', value: sweaterLabels[minIdx] + ' (' + sweaterData[minIdx] + ')' }
];

metrics.forEach(m => {
    const card = document.createElement('div');
    card.style.cssText = 'flex: 1; min-width: 120px; background: #f5f7fa; border-radius: 8px; padding: 16px;';
    card.innerHTML = '<div style="font-size: 13px; color: #5f6368;">' + m.label + '</div>'
        + '<div style="font-size: 24px; font-weight: 600; color: #333;">' + m.value + '</div>';
    metricsContainer.appendChild(card);
});

// Build custom legend
const legendContainer = document.createElement('div');
legendContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 12px; font-size: 13px; color: #5f6368;';

sweaterLabels.forEach((label, i) => {
    const pct = Math.round(sweaterData[i] / sweaterTotal * 100);
    const item = document.createElement('span');
    item.style.cssText = 'display: flex; align-items: center; gap: 6px;';
    item.innerHTML = '<span style="width: 12px; height: 12px; border-radius: 3px; background: '
        + sweaterColors[i] + ';"></span>' + label + ' \u2014 ' + sweaterData[i] + ' (' + pct + '%)';
    legendContainer.appendChild(item);
});

// Build canvas wrapper
const canvasWrapper = document.createElement('div');
canvasWrapper.style.cssText = 'position: relative; width: 100%; max-width: 500px; height: 400px; margin: 0 auto;';

const canvas = document.createElement('canvas');
canvas.id = 'sweater-pie-chart';
canvasWrapper.appendChild(canvas);

// Append everything to #donut-chart container
const chartContainer = document.getElementById('donut-chart');
chartContainer.appendChild(metricsContainer);
chartContainer.appendChild(legendContainer);
chartContainer.appendChild(canvasWrapper);

// Create pie chart
new Chart(canvas, {
    type: 'pie',
    data: {
        labels: sweaterLabels,
        datasets: [{
            data: sweaterData,
            backgroundColor: sweaterColors,
            borderWidth: 2,
            borderColor: 'rgba(255, 255, 255, 0.8)',
            hoverOffset: 12
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function(ctx) {
                        var val = ctx.parsed;
                        var pct = Math.round(val / sweaterTotal * 100);
                        return ctx.label + ': ' + val + ' units (' + pct + '%)';
                    }
                }
            }
        }
    }
});
