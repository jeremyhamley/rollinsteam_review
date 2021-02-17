
// create a function to unpack data
function unpack(rows, index) {
    return rows.map(function (row) {
        return row[index];
    });
}

// create a function to find unique data
function uniq_fast(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = a[i];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         }
    }
    return out;
}

// read data, collect ids, and load the ids into the dropdown  //

d3.csv("data/2020_promo_items_all.csv").then(function (data) {
    console.log (data)
    var ids = unpack(data, "brand");
    var uniq_ids = uniq_fast(ids);
    console.log(uniq_ids);
    d3.select("#selDataset")
        .selectAll("select")
        .data(uniq_ids)
        .enter()
        .append("option")
        .html(function (d) {
            return `<option value ="${d}">${d}</option>`;
        });

    updatePlotly();
});

// ----------------------------------------------------  //




// // ----------------------------------------------------  //

// Create and Call function:  updatePlotly() when a change takes place to the DOM //

d3.selectAll("#selDataset").on("change", updatePlotly);

// This function is called when a dropdown menu item is selected
function updatePlotly() {
    // Use D3 to select the dropdown menu
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var dataset = dropdownMenu.property("value");
    console.log(dataset)


    // ----------------------------------------------------  //
    //  Pull data for the id selected in the dropdown //

    d3.csv("data/2020_promo_items_all.csv").then((data) => {
        var brand_data = data.find(({ brand }) => brand === dataset);
        console.log(brand_data);
        // store the top 10 values for the bar chart
        var brand_sliced = person_id.otu_ids.slice(0, 10);
        
        console.log(otu_ids_sliced);

        var values_sliced = person_id.sample_values.slice(0, 10);
        console.log(values_sliced);

        var labels_sliced = person_id.otu_labels.slice(0, 10);
        console.log(labels_sliced);



        // ----------------------------------------------------  //
        //  Create the bar chart //

        var y = otu_ids_sliced.map(function (a) { return "OTU ID " + a; });
        var x = values_sliced.sort((a, b) => a - b);
        var labels = labels_sliced;

        var trace1 = {
            x: x,
            y: y,
            type: "bar",
            text: labels,
            orientation: "h"
        };

        // Create the data array for the plot
        var data1 = [trace1];

        // Define the plot layout
        var layout = {
            title: "Top 10 OTUs (Operational Taxonomic Units)",
            xaxis: { title: "Microbe Count" },
            barmode: "group"
        };

        // Plot the chart to a div tag with id "bar"
        Plotly.newPlot("bar", data1, layout);




        // ---------------------------------------------------- //
        // Collect data for Bubble chart //


        var otu_ids = person_id.otu_ids;
        var values = person_id.sample_values;
        var labels = person_id.otu_labels;

        var x2 = otu_ids;
        var y2 = values;
        var labels2 = labels;

        var trace2 = {
            x: x2,
            y: y2,
            mode: "markers",
            text: labels2,
            marker: {
                color: otu_ids,
                size: values
            }
        };

        // ---------------------------------------------------- //
        // Create Bubble chart //

        var data2 = [trace2];
        // Define the plot layout
        var layout2 = {
            title: "OTUs (Operational Taxonomic Units)",
            xaxis: { title: "OTU ID" },
        };
        // Plot the chart to a div tag with id "bubble"
        Plotly.newPlot("bubble", data2, layout2);

    });


    // ---------------------------------------------------- //
    // Collect and display data for Demographic Info card

    dem_dataset = parseInt(dataset)
    d3.json("samples.json").then((data) => {
        var dem_data = data.metadata.find(({ id }) => id === dem_dataset);

        var indv_dem_data = d3.select("#sample-metadata");
        indv_dem_data.text("");
        Object.entries(dem_data).forEach((key) => {   
            indv_dem_data.append("h4").text(key[0] + ": " + key[1]);    
        });



        //  ----------------------------------------------------  //

        // Add the Gauge Chart

        // add var for wash frequency gauge
        var wfreq = dem_data.wfreq;
        console.log(wfreq)

        var trace3 = {
            domain: { x: [0, 1], y: [0, 1] },
            value: wfreq,
            title: { text: "Belly Button Scrubs per Week" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: {range: [null,9], tickwidth: 5},
                bar: { color: "yellow" },
                steps: [
                    { range: [0,2], color: "greenyellow"},
                    { range: [2,4], color: "lightgreen"},
                    { range: [4,6], color: "green"},
                    { range: [6,8], color: "darkgreen"},
                    { range: [8,9], color: "greenblue"},
                ]

            }
        };
        // Create the data array for the plot
        var data3 = [trace3];

        // Plot the chart to a div tag with id "gauge"
        Plotly.newPlot("gauge", data3);

    });
  
};
