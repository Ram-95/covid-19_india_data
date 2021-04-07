var state_names = [];
var total_confirmed = [];
var total_active = [];

$(document).ready(function () {
    const time_series_url = 'https://api.covid19india.org/v4/min/timeseries.min.json';
    /* Format: https://api.covid19india.org/v4/min/timeseries-{state_code}.min.json */
    const url = 'https://api.covid19india.org/v4/min/data.min.json'
    const state_code = {
        'AN': 'Andaman and Nicobar', 'AP': 'Andhra Pradesh', 'AR': 'Arunachal Pradesh', 'AS': 'Assam', 'BR': 'Bihar', 'TT': 'Total',
        'CH': 'Chandigarh', 'CT': 'Chattisgarh', 'DL': 'Delhi', 'DN': 'Dadra and Nagar Haveli', 'GA': 'Goa', 'GJ': 'Gujarat',
        'HP': 'Himachal Pradesh', 'HR': 'Haryana', 'JH': 'Jharkhand', 'JK': 'Jammu and Kashmir', 'KA': 'Karnataka', 'KL': 'Kerala',
        'LA': 'Ladakh', 'LD': 'Lakshadweep', 'MH': 'Maharashtra', 'ML': 'Meghalaya', 'MN': 'Manipur', 'MP': 'Madhya Pradesh',
        'MZ': 'Mizoram', 'NL': 'Nagaland', 'OR': 'Odisha', 'PB': 'Punjab', 'PY': 'Puducherry', 'RJ': 'Rajasthan', 'SK': 'Sikkim',
        'TG': 'Telangana', 'TN': 'Tamil Nadu', 'TR': 'Tripura', 'UP': 'Uttar Pradesh', 'UT': 'Uttarakhand', 'WB': 'West Bengal'
    };



    /* Function that plots the time series data  */
    function plot_time_series_data(state) {
        let urls = 'https://api.covid19india.org/v4/min/timeseries-' + state + '.min.json';
        let date_range = []
        let confirmed_cases = []
        let deceased_cases = []
        let recovered_cases = []
        let active_cases = []

        let mode = 'lines+markers';

        Plotly.d3.json(urls, function (figure) {
            let data = figure[state]['dates'];
            $.each(data, function (item) {
                //console.log(data[item]['total']);
                //console.log(item);
                date_range.push(item);
                confirmed_cases.push(data[item]['total']['confirmed']);
                deceased_cases.push(data[item]['total']['deceased']);
                recovered_cases.push(data[item]['total']['recovered']);
                active_cases.push(data[item]['total']['confirmed'] - data[item]['total']['recovered'] - data[item]['total']['deceased'])
            });
            var trace1 = {
                x: date_range,
                y: confirmed_cases,
                marker: { color: 'blue' },
                mode: mode,
                name: 'Confirmed'
            }

            var trace2 = {
                x: date_range,
                y: deceased_cases,
                xaxis: 'x2',
                yaxis: 'y2',
                marker: { color: 'red' },
                mode: mode,
                name: 'Deceased'
            }

            var trace3 = {
                x: date_range,
                y: recovered_cases,
                xaxis: 'x3',
                yaxis: 'y3',
                marker: { color: 'green' },
                mode: mode,
                name: 'Recovered'
            }

            var trace4 = {
                x: date_range,
                y: active_cases,
                xaxis: 'x4',
                yaxis: 'y4',
                marker: { color: '#f05be8' },
                mode: mode,
                name: 'Active'
            }

            var layout = {
                grid: { rows: 2, columns: 2, pattern: 'independent' },
                title: 'COVID-19 Data - ' + state_code[state]
            };

            Plotly.plot('totalDiv', [trace1, trace2, trace3, trace4], layout, { displayModeBar: false });

        });
    }


    /*
        $.getJSON(time_series_url, function (data) {
            var TT_time_series = data['TT']['dates'];
            //console.log(TT_time_series);
            $.each(TT_time_series, function (item) {
                // Total Time series figures of whole India.
                var ts_total = TT_time_series[item]['total'];
                var ts_confirmed = ts_total['confirmed'] == undefined ? 0 : ts_total['confirmed'];
                var ts_recovered = ts_total['recovered'] == undefined ? 0 : ts_total['recovered'];
                var ts_deceased = ts_total['deceased'] == undefined ? 0 : ts_total['deceased'];
                var ts_tested = ts_total['tested'] == undefined ? 0 : ts_total['tested'];
                //console.log(ts_total);
            });
        });
    */


    function fetch_data() {
        //$('#main_table > tbody').empty();
        //console.log('Executed');

        $.getJSON(url, function (data) {
            var updated_date = data['TT']['meta']['last_updated'];
            // Adding the updated date
            x = updated_date.split('T');
            $('.updated_date').text(x[0] + ', ' + x[1].split('+')[0] + ' (IST)');

            $.each(data, function (item) {
                /* Used in plotting Bar graphs */
                var total = data[item]['total'];
                if (item != 'TT') {
                    state_names.push(state_code[item]);
                    total_confirmed.push(total['confirmed']);
                    total_active.push(total['confirmed'] - total['deceased'] - total['recovered']);
                }


                // Total Cases
                var confirmed = total['confirmed'].toLocaleString('en-IN');
                var deceased = total['deceased'].toLocaleString('en-IN');
                var recovered = total['recovered'].toLocaleString('en-IN');
                var tested = total['tested'].toLocaleString('en-IN');
                var vaccinated = total['vaccinated'].toLocaleString('en-IN');
                var active = total['confirmed'] - total['deceased'] - total['recovered'];

                // Today's Data
                if (data[item].delta) {
                    var today_confirmed = data[item]['delta']['confirmed'] == undefined ? 0 : data[item]['delta']['confirmed'].toLocaleString('en-IN');
                    var today_deceased = data[item]['delta']['deceased'] == undefined ? 0 : data[item]['delta']['deceased'].toLocaleString('en-IN');
                    var today_recovered = data[item]['delta']['recovered'] == undefined ? 0 : data[item]['delta']['recovered'].toLocaleString('en-IN');
                    var today_vaccinated = data[item]['delta']['vaccinated'] == undefined ? 0 : data[item]['delta']['vaccinated'].toLocaleString('en-IN');
                    if (item != 'TT') {
                        var row = '<tr><td><a class="state_name" href="' + item + '">' + state_code[item] + ' (' + item + ')</a>' + '</td><td>' + confirmed + '<small class="confirmed">(+' + today_confirmed + ')</small>' + '<td>' + active.toLocaleString('en-IN') + '</td>' + '</td>' + '<td>' + deceased + '<small class="deceased">(+' + today_deceased + ')</small>' + '</td><td>' + recovered + '<small class="recovered">(+' + today_recovered + ')</small>' + '</td><td>' + tested + '</td><td>' + vaccinated + '<small class="vaccinated">(+' + today_vaccinated + ')</small>' + '</td></tr>';
                    }

                    //console.log(item, data[item]['delta']);
                }
                else if (data[item].delta7) {
                    var today_confirmed = data[item]['delta7']['confirmed'] == undefined ? 0 : data[item]['delta7']['confirmed'].toLocaleString('en-IN');
                    var today_deceased = data[item]['delta7']['deceased'] == undefined ? 0 : data[item]['delta7']['deceased'].toLocaleString('en-IN');
                    var today_recovered = data[item]['delta7']['recovered'] == undefined ? 0 : data[item]['delta7']['recovered'].toLocaleString('en-IN');
                    var today_vaccinated = data[item]['delta7']['vaccinated'] == undefined ? 0 : data[item]['delta7']['vaccinated'].toLocaleString('en-IN');
                    var today_tested = data[item]['delta7']['tested'] == undefined ? 0 : data[item]['delta7']['tested'].toLocaleString('en-IN');

                    var row = '<tr><td><a class="state_name" href="' + item + '">' + state_code[item] + ' (' + item + ')</a>' + '</td><td>' + confirmed + '<small class="confirmed">(+' + today_confirmed + ')</small>' + '</td><td>' + active.toLocaleString('en-IN') + '</td><td>' + deceased + '<small class="deceased">(+' + today_deceased + ')</small>' + '</td><td>' + recovered + '<small class="recovered">(+' + today_recovered + ')</small>' + '</td><td>' + tested + '<small class="tested">(+' + today_tested + ')</small></td><td>' + vaccinated + '<small class="vaccinated">(+' + today_vaccinated + ')</small>' + '</td></tr>';
                }
                $('.main_table').append(row);
                //console.log(item, data[item]);

            });
            // Appending the Total figures at the last

            var today_confirmed = data['TT']['delta']['confirmed'] == undefined ? 0 : data['TT']['delta']['confirmed'].toLocaleString('en-IN');
            var today_deceased = data['TT']['delta']['deceased'] == undefined ? 0 : data['TT']['delta']['deceased'].toLocaleString('en-IN');
            var today_recovered = data['TT']['delta']['recovered'] == undefined ? 0 : data['TT']['delta']['recovered'].toLocaleString('en-IN');
            var today_vaccinated = data['TT']['delta']['vaccinated'] == undefined ? 0 : data['TT']['delta7']['vaccinated'].toLocaleString('en-IN');
            var today_tested = data['TT']['delta']['tested'] == undefined ? 0 : data['TT']['delta7']['tested'].toLocaleString('en-IN');
            var today_active = data['TT']['total']['confirmed'] - data['TT']['total']['deceased'] - data['TT']['total']['recovered'] - data['TT']['total']['other'];

            var row = '<tr style="background-color: lightyellow; font-weight: 700;"><td><a class="sticky-col first-col">' + state_code['TT'] + ' (' + 'TT' + ')</a>' + '</td><td>' + data['TT']['total']['confirmed'].toLocaleString('en-IN') + '<small class="confirmed">(+' + today_confirmed + ')</small></td><td>' + today_active.toLocaleString('en-IN') + '</td>' + '<td>' + data['TT']['total']['deceased'].toLocaleString('en-IN') + '<small class="deceased">(+' + today_deceased + ')</small>' + '</td><td>' + data['TT']['total']['recovered'].toLocaleString('en-IN') + '<small class="recovered">(+' + today_recovered + ')</small>' + '</td><td>' + data['TT']['total']['tested'].toLocaleString('en-IN') + ' <small class="tested">(+' + today_tested + ')</small></td><td>' + data['TT']['total']['vaccinated'].toLocaleString('en-IN') + '<small style="color: blue;">(+' + today_vaccinated + ')</small>' + '</td></tr>';
            $('.main_table').append(row);
            states_bar_chart(state_names, total_confirmed, total_active);
        });
        $('.footer > small').text('Source: ' + url);


    }

    function states_bar_chart(state_names, total_confirmed, total_active) {
        var trace1 = {
            x: state_names,
            y: total_confirmed,
            type: 'bar',
            name: 'Confirmed',
            marker: {
              color: 'rgb(10, 228, 240)',
              opacity: 0.7,
            }
          };
          
          var trace2 = {
            x: state_names,
            y: total_active,
            type: 'bar',
            name: 'Active',
            marker: {
              color: 'rgb(252, 111, 3)',
              opacity: 0.5
            }
          };
          
          var data = [trace1, trace2];
          
          var layout = {
            title: 'State wise Data',
            xaxis: {
              tickangle: -45
            },
            barmode: 'group'
          };
          
          Plotly.newPlot('totalBarDiv', data, layout);

    }

    fetch_data();
    plot_time_series_data('TT');
});
