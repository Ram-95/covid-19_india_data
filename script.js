$(document).ready(function () {
    const url = 'https://api.covid19india.org/v4/min/data.min.json'
    const state_code = {
        'AN': 'Andaman and Nicobar', 'AP': 'Andhra Pradesh', 'AR': 'Arunachal Pradesh', 'AS': 'Assam', 'BR': 'Bihar', 'TT': 'Total',
        'CH': 'Chandigarh', 'CT': 'Chattisgarh', 'DL': 'Delhi', 'DN': 'Dadra and Nagar Haveli', 'GA': 'Goa', 'GJ': 'Gujarat',
        'HP': 'Himachal Pradesh', 'HR': 'Haryana', 'JH': 'Jharkhand', 'JK': 'Jammu and Kashmir', 'KA': 'Karnataka', 'KL': 'Kerala',
        'LA': 'Ladakh', 'LD': 'Lakshadweep', 'MH': 'Maharashtra', 'ML': 'Meghalaya', 'MN': 'Manipur', 'MP': 'Madhya Pradesh',
        'MZ': 'Mizoram', 'NL': 'Nagaland', 'OR': 'Odisha', 'PB': 'Punjab', 'PY': 'Puducherry', 'RJ': 'Rajasthan', 'SK': 'Sikkim',
        'TG': 'Telangana', 'TN': 'Tamil Nadu', 'TR': 'Tripura', 'UP': 'Uttar Pradesh', 'UT': 'Uttarakhand', 'WB': 'West Bengal'
    };
    function fetch_data() {
        $.getJSON(url, function (data) {
            $.each(data, function (item) {
                var total = data[item]['total'];
                var confirmed = total['confirmed'];
                var deceased = total['deceased'];
                var recovered = total['recovered'];
                var tested = total['tested']
                var vaccinated = total['vaccinated'];

                // Today's Data
                if (data[item].delta) {
                    var today_confirmed = data[item]['delta']['confirmed'];
                    var today_deceased = data[item]['delta']['deceased'];
                    var today_recovered = data[item]['delta']['recovered'];

                    if (item != 'TT') {
                        var row = '<tr><td><a href="#">' + state_code[item] + ' (' + item + ')</a>' + '</td><td>' + confirmed + '<small class="confirmed">(+' + today_confirmed + ')</small>' + '</td>' + '<td>' + deceased + '<small class="deceased">(+' + today_deceased + ')</small>' + '</td><td>' + recovered + '<small class="recovered">(+' + today_recovered + ')</small>' + '</td><td>' + tested + '</td><td>' + vaccinated + '</td></tr>';
                    }
                    $('.main_table').append(row);
                    console.log(item, data[item]['delta']);
                }

            })
            // Appending the Total figures at the last
            var today_confirmed = data['TT']['delta']['confirmed'];
            var today_deceased = data['TT']['delta']['deceased'];
            var today_recovered = data['TT']['delta']['recovered'];
            var row = '<tr style="background-color: pink; font-weight: 700;"><td><a href="#">' + state_code['TT'] + ' (' + 'TT' + ')</a>' + '</td><td>' + data['TT']['total']['confirmed'] + '<small class="confirmed">(+' + today_confirmed + ')</small>' + '</td>' + '<td>' + data['TT']['total']['deceased'] + '<small class="deceased">(+' + today_deceased + ')</small>' + '</td><td>' + data['TT']['total']['recovered'] + '<small class="recovered">(+' + today_recovered + ')</small>' + '</td><td>' + data['TT']['total']['tested'] + '</td><td>' + data['TT']['total']['vaccinated'] + '</td></tr>';
            $('.main_table').append(row);

        });
        $('.footer').text(url);
    }
    fetch_data();

    /* Refreshes every 30 seconds
    window.setInterval(function () {
        fetch_data();
    }, 3000);
    */

});