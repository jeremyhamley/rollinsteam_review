
// create a function to unpack data
function unpack(rows, index) {
    return rows.map(function (row) {
        return row[index];
    });
}


// read data, collect ids, and load the ids into the dropdown  //

d3.csv("data/merged_house_data2.csv").then(function (data) {
    var ids = unpack(data,"RegionName");

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      } 
      var unique = ids.filter(onlyUnique);

    // console.log(data);
    d3.select("#selDataset")
        .selectAll("select")
        .data(unique)
        .enter()
        .append("option")
        .html(function (d) {
            return `<option value ="${d}">${d}</option>`;
        });


    
    updatePlotly();
});

// ----------------------------------------------------  //




// ----------------------------------------------------  //

// Create and Call function:  updatePlotly() when a change takes place to the DOM //

d3.selectAll("#selDataset").on("change", updatePlotly);

// This function is called when a dropdown menu item is selected
function updatePlotly() {
    // Use D3 to select the dropdown menu
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var dataset = dropdownMenu.property("value");
    // console.log(dataset)


    // ----------------------------------------------------  //
    //  Pull data for the id selected in the dropdown //

    d3.csv("data/merged_house_data2.csv").then((data) => {
        var zip_id_2 = data.filter(function(row){
            return row['RegionName'] == dataset & row['bedrooms'] == "2";
        });
        var zip_id_3 = data.filter(function(row){
            return row['RegionName'] == dataset & row['bedrooms'] == "3";
        });
        var zip_id_4 = data.filter(function(row){
            return row['RegionName'] == dataset & row['bedrooms'] == "4";
        });
        var zip_id_5 = data.filter(function(row){
            return row['RegionName'] == dataset & row['bedrooms'] == "5";
        });
        var zip_info_all = data.find(({ RegionName }) => RegionName === dataset);

        var city = zip_info_all.City;


        var indv_zip_data = d3.select("#zip-data");
        indv_zip_data.text("");  
        indv_zip_data.append("h4").text(city);
        

          // convert strings to int
        zip_id_2.forEach(function(zip_id_2) {
            zip_id_2.median = +zip_id_2.median;
        });
        zip_id_3.forEach(function(zip_id_3) {
            zip_id_3.median = +zip_id_3.median;
        });
        zip_id_4.forEach(function(zip_id_4) {
            zip_id_4.median = +zip_id_4.median;
        });
        zip_id_5.forEach(function(zip_id_5) {
            zip_id_5.median = +zip_id_5.median;
        });

        //  Create the line chart //

        var y2 = [];
        var x2 = [];
        y2 = zip_id_2.map(function(d) {return d.median; });
        x2 = zip_id_2.map(function(d) {return d.date; });

        var y3 = [];
        var x3 = [];
        y3 = zip_id_3.map(function(d) {return d.median; });
        x3 = zip_id_3.map(function(d) {return d.date; });

        var y4 = [];
        var x4 = [];
        y4 = zip_id_4.map(function(d) {return d.median; });
        x4 = zip_id_4.map(function(d) {return d.date; });

        var y5 = [];
        var x5 = [];
        y5 = zip_id_5.map(function(d) {return d.median; });
        x5 = zip_id_5.map(function(d) {return d.date; });


        var trace2 = {
            x: x2,
            y: y2,
            mode: 'lines',
            name: '2 Bedroom'
        };
        var trace3 = {
            x: x3,
            y: y3,
            mode: 'lines',
            name: '3 Bedroom'
        };
        var trace4 = {
            x: x4,
            y: y4,
            mode: 'lines',
            name: '4 Bedroom'
        };
        var trace5 = {
            x: x5,
            y: y5,
            mode: 'lines',
            name: '5 Bedroom'
        };

        // Create the data array for the plot
        var data1 = [trace5 ,trace4, trace3, trace2];

        // Define the plot layout
        var layout = {
            title: "Mean Home Value Over Time",
            xaxis: { title: "Year" },
            yaxis: {title: "Mean Home Value"}
        };

        // Plot the chart to a div tag with id "bar"
        Plotly.newPlot("line", data1, layout);

    });

     
};
