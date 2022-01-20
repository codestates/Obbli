import { Skill } from '../entity';

export default function (req, res) {
  Skill.find()
    .then(data => { res.status(200).send(data) })
    .catch(e => res.status(500).send());
}
