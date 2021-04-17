var ctx = document.getElementById("chart").getContext("2d");


Chart.pluginService.register();

/*** Gradient ***/
var yAxis = chartInstance.scales['y-axis-0'];
var minValueYPixel = yAxis.getPixelForValue(minValue);
var maxValueYPixel = yAxis.getPixelForValue(maxValue);

var gradient = ctx.createLinearGradient(0, minValueYPixel, 0, maxValueYPixel);
// var gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, 'rgba(250,174,50,1)');
gradient.addColorStop(1, 'rgba(250,174,50,0)');
/***************/


var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ["First", "Second", "Third", "Fourth", "Fifth"],
        datasets: [{
            label: 'My Sample Dataset',
            data: [20, 30, 50, 10, 40],
            // No curves.
            tension: 0,
            // No fill under the line.
            fill: false
        }],
    },
    options: {
        // Option for coloring the line with a gradient.
        linearGradientLine: true,
        scales: {
            yAxes: [{
                ticks: {
                    min: 0,
                    max: 100,
                    stepSize: 20
                }
            }]
        }
    }
})
// /*** Gradient ***/
// var gradient = ctx.createLinearGradient(0, 0, 0, 400);
// gradient.addColorStop(0, 'rgba(250,174,50,1)');
// gradient.addColorStop(1, 'rgba(250,174,50,0)');
// /***************/

// var data = {
//     labels: ["02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00",
//         "22:00", "00:00"
//     ],
//     datasets: [{
//         fillColor: gradient, // Put the gradient here as a fill color
//         strokeColor: "#ff6c23",
//         pointColor: "#fff",
//         pointStrokeColor: "#ff6c23",
//         pointHighlightFill: "#fff",
//         pointHighlightStroke: "#ff6c23",
//         data: [25.0, 32.4, 22.2, 39.4, 34.2, 22.0, 23.2, 24.1, 20.0, 18.4, 19.1, 17.4]
//     }]
// };

// var options = {
//     responsive: true,
//     datasetStrokeWidth: 3,
//     pointDotStrokeWidth: 4,
//     tooltipFillColor: "rgba(0,0,0,0.8)",
//     tooltipFontStyle: "bold",
//     tooltipTemplate: "<%if (label){%><%=label + ' hod' %>: <%}%><%= value + '°C' %>",
//     scaleLabel: "<%= Number(value).toFixed(0).replace('.', ',') + '°C'%>"
// };