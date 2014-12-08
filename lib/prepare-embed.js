/**
 * Expose `prepareEmbed`
 */

module.exports = prepareEmbed;

/**
 * Prepare an iframe for API control. 
 *
 * Embedded Vimeo videos require `api` & `player_id`
 * parameters set to be controlled.
 *
 * @param {String} embedID - id of iframe to prepare
 */

function prepareEmbed(embedID) {
  var embed = document.getElementById(embedID);

  if (!isEmbeddedVideo(embed)) {
    throw new Error('embed must be an iframe');
  }

  enableAPIControl(embed);
}

/**
 * Enable API control via `embed.src` parameters
 *
 * @param {Object} embed
 */

function enableAPIControl(embed) {
  if (!isAPIEnabled(embed)) {
    embed.src += '?api=1&player_id=' + embed.id;
  }
}

/**
 * Determine if required `src` parameters are included in `embed`
 *
 * @param {Object} embed
 * @returns {Boolean}
 */

function isAPIEnabled(embed) {
  var regex = '\/?api=1&player_id=' + embed.id;
  regex = new RegExp(regex);
  return regex.test(embed.src);
}

/**
 * @param {Object} [embed]
 * @returns {Boolean}
 */

function isEmbeddedVideo(embed) {
  return embed && embed.tagName === 'IFRAME';
}
