$(document).ready(function() {

    function clearForm(formId) {
        $('#search-results-keyword, #search-results-numbers, #search-results').html('');
        $('#search-results, #search-spinner').css('display', 'none');
        document.getElementById(formId).reset();
    }

    $('#form-clear').on('click', function() {
        clearForm('pg_search');
        $('#keyword').focus();
    });

    $('#pg_search').on('submit', function(event) {
        event.preventDefault();
        var keyword = $('#keyword').val();

        //reset notice fields (for new search without closing modal)
        $('#search-results, #search-spinner').css('display', 'none');
        $('#search-results').html('');

        if(keyword !== '') {
            $('#search-results-keyword').html('Search results for: <strong>' + keyword + '</strong>');
            var boldMe = new RegExp(keyword, 'gi');

            $.ajax({
                method: 'POST',
                data: {keyword: keyword},
                url: 'search_processor.php',
                cache: false,
                beforeSend: function() {
                    $('#pg_search input[type=submit]').prop('disabled', true);
                    $('#search-spinner').fadeIn(500);
                }
            })
                .done(function(data) {
                    var dataArr = data.split('^^');
                    var listings = dataArr.slice(0, dataArr.length - 1);
                    var nums = dataArr[dataArr.length - 1];

                    $('#search-results-numbers').text(nums);

                    if(nums === 'No results found') {
                        $('#search-results').html('Sorry, ' + nums + ' for term <strong>' + keyword + '</strong>');
                    } else {
                        listings.forEach(function(listing) {
                            $(listing).appendTo('#search-results');
                        });
                        $('.search-results-text').each(function() {
                            $(this).html($(this).html().replace(boldMe, '<strong>'+keyword+'</strong>'));
                        });
                        $('#search-results a').on('click', function() {
                            $('#searchModal').modal('hide');
                        });
                    }

                    $('#search-spinner').fadeOut(0, function() {
                        $('#search-results').slideDown(800);
                        $('#pg_search input[type=submit]').prop('disabled', false);
                    });

                });
        } else {
            $('#search-results').html('<div style="text-align: center;font-weight:bold;">Please Enter a Search Keyword or Phrase</div>').show();
            $('#keyword').focus();
        }
    });

    $('#searchModal').on('shown.bs.modal', function() {
        clearForm('pg_search');
        $('#keyword').focus();
    });

    $('#searchModal').on('hidden.bs.modal', function() {
        clearForm('pg_search');
    });
});