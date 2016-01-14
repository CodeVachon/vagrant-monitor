(function() {
  var do_event, draw_button, draw_log, draw_row, draw_state, reload;

  $(document).ready(function() {
    console.log("The Document Is Ready");
    $('#ReloadBtn').on('click', reload);
    return reload();
  });

  reload = function() {
    if ($('#ReloadBtn').hasClass('disabled')) {
      return;
    }
    $('#ReloadBtn').addClass('disabled');
    return $.getJSON('/vagrant/global-status').done(function(data) {
      $('#GlobalStatus tbody').html("");
      data.forEach(function(record) {
        return $('#GlobalStatus tbody').append(draw_row(record));
      });
      return $('#ReloadBtn').removeClass('disabled');
    });
  };

  draw_row = function(record) {
    var buttons;
    buttons = $('<div>').addClass('btn-group btn-group-xs');
    if (record.state.toLowerCase() === "running") {
      buttons.append(draw_button("halt", do_event, record)).append(draw_button("suspend", do_event, record));
    } else {
      buttons.append(draw_button("up", do_event, record));
    }
    return $('<tr>').append($('<td>').html(record.id)).append($('<td>').html(record.name)).append($('<td>').html(record.provider)).append($('<td>').html(draw_state(record.state))).append($('<td>').html(record.directory)).append($('<td>').append(buttons));
  };

  draw_state = function(label) {
    var className;
    className = "label ";
    if (label === "running") {
      className += "label-success";
    } else {
      className += "label-danger";
    }
    return $('<span>').addClass(className).html(label);
  };

  draw_button = function(label, callback, data, btn_class) {
    return $('<button>').addClass('btn ' + (btn_class || "btn-default")).html(label).attr(data || {}).on('click', callback || function(event) {
      event.preventDefault();
      return alert("Make Me Do Something!!!");
    });
  };

  do_event = function(event) {
    var _row, _this;
    event.preventDefault();
    _this = $(this);
    _row = _this.closest('tr');
    if (_row.hasClass('warning')) {
      return alert("Action already in progress");
    }
    _row.addClass('warning');
    _row.find('.label').removeClass('label-danger label-success').addClass('label-warning').html('Working...');
    _this.addClass('disabled');
    return $.getJSON('/vagrant/' + _this.html() + '/' + _this.attr('id')).done(function(return_data) {
      draw_log(return_data);
      return $.getJSON('/vagrant/status/' + _this.attr('id')).done(function(status_data) {
        return _row.replaceWith(draw_row(status_data));
      });
    });
  };

  draw_log = function(data) {
    $('#Log #logdata').html(data.join("\n\r"));
    return $('#Log').modal('show');
  };

}).call(this);
