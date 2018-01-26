var _ = require('lodash');
var XRegExp = require('xregexp');

module.exports = (robot) => {
  robot.respond(/go ([a-zA-z0-9亜-熙ぁ-んァ-ヶ]+)(?: (\d+))?(?: with (@\w+))?/, (msg) => {

    const regex = XRegExp("go (?<eventType>[a-zA-z0-9亜-熙ぁ-んァ-ヶ]+)(?: (?<num>\\d+))?(?: with (?<leader>@\\w+))?");

    const rawStr = msg.match[0];
    const match = XRegExp.exec(rawStr, regex);

    let eventType = match.eventType;
    let num = match.num || 3;
    let leader = match.leader;

    let chosen = [];
    if (leader) {
      chosen = _.sampleSize(
        _.reject(robot.brain.data['member'], (m) => {
          return leader === m
        }), num-1
      )

      chosen.push(leader)
    } else {
      chosen = _.sampleSize(robot.brain.data['member'], num)
    }

    msg.send(chosen.join(' '));
    msg.send(`${eventType}に行きましょう`);
  });

  robot.respond(/add (@\w+)/, (msg) => {
    userName = msg.match[1];

    if (!robot.brain.data['member']) {
      robot.brain.data['member'] = [];
    }

    if (robot.brain.data['member'].indexOf(userName) >= 0) {
      msg.send(`すでに \`${userName}\` さんはメンバーに追加されています`);
    } else {
      robot.brain.data['member'].push(userName)
      msg.send(`\`${userName}\` さんをメンバーに追加しました`);
    }
  });

  robot.respond(/remove (@\w+)/, (msg) => {
    userName = msg.match[1];
    if (robot.brain.data['member'].indexOf(userName) >= 0) {
      robot.brain.data['member'].splice(robot.brain.data['member'].indexOf(userName), 1)
      msg.send(`\`${userName}\` さんをメンバーから削除しました`);
    } else {
      msg.send(`\`${userName}\` さんはメンバーに存在しません`);
    }
  });

  robot.respond(/clear/, (msg) => {
    robot.brain.data['member'] = [];
    msg.send('メンバーリストをクリアしました')
  });

  robot.respond(/members/, (msg) => {
    msg.send('現在追加されているメンバー');
    msg.send(
      robot.brain.data['member'].map((userName) => {
        return `\`${userName}\``
      }).join(', ')
    );
  });
};
