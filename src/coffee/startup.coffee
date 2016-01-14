$(document).ready( ->
    console.log "The Document Is Ready"
    $('#ReloadBtn').on('click', reload)
    reload()
)


reload = () ->
    if $('#ReloadBtn').hasClass('disabled')
      return
    $('#ReloadBtn').addClass('disabled')
    return $.getJSON('/vagrant/global-status').done( ( data ) ->
        $('#GlobalStatus tbody').html("")
        data.forEach (record) ->
            return $('#GlobalStatus tbody').append( draw_row( record ) )
        return $('#ReloadBtn').removeClass('disabled')
    )
#close reload


draw_row = ( record ) ->
    buttons = $('<div>').addClass('btn-group btn-group-xs')
    if record.state.toLowerCase() == "running"
        buttons
            .append( draw_button("halt", do_event, record) )
            .append( draw_button("suspend", do_event, record) )
    else
        buttons
            .append( draw_button( "up", do_event, record) )

    return $('<tr>')
        .append($('<td>').html( record.id ))
        .append($('<td>').html( record.name ))
        .append($('<td>').html( record.provider ))
        .append($('<td>').html( draw_state(record.state) ))
        .append($('<td>').html( record.directory ))
        .append($('<td>').append( buttons ))
# close draw_row


draw_state = ( label ) ->
    className = "label "
    if label == "running"
        className += "label-success"
    else
        className += "label-danger"

    return $('<span>')
        .addClass( className )
        .html( label )
# close draw_state


draw_button = ( label, callback, data, btn_class ) ->
    return $('<button>')
        .addClass('btn ' + (btn_class || "btn-default"))
        .html( label )
        .attr( data || {} )
        .on('click', callback || ( event ) ->
            event.preventDefault()
            alert "Make Me Do Something!!!"
        )
# close draw_button


do_event = ( event ) ->
    event.preventDefault()
    _this = $(@)
    _row = _this.closest('tr')

    if _row.hasClass('warning')
        return alert "Action already in progress"

    _row.addClass('warning')
    _row.find('.label')
        .removeClass('label-danger label-success')
        .addClass('label-warning')
        .html('Working...')
    _this.addClass('disabled')

    return $.getJSON('/vagrant/' + _this.html() + '/' + _this.attr('id')).done( ( return_data ) ->
        draw_log( return_data )
        return $.getJSON('/vagrant/status/' + _this.attr('id')).done( ( status_data ) ->
            return _row.replaceWith( draw_row( status_data ) )
        )
    )
# close do_up


draw_log = ( data ) ->
    $('#Log #logdata').html(data.join("\n\r"))
    $('#Log').modal('show')
# close draw_log
