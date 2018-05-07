const Bar = require('../models/bar');
const yelp = require('yelp-fusion');
const client = yelp.client('qaGd6x9afdwHUx62I_jU64xcrm2ymtWaQxjgE5sJZh6sUWtn8LDZzac7zndrJJdjcA3J1L-77LdT_Gz6i6Lhk8a4xNPELNmPUqkBnCg_HKBGEw9AEr1mQbs7HdPkWnYx');
exports.barQuery = function(req, res, next) {
    //use business alias instead of id
    const query = req.params.query;
    let savedBars = [];
    Bar.find({}, function(err, result) {
        savedBars = result;
    });
    client.search({
        term: 'bars',
        location: query
    })
    .then(function(response) {
        let businesses = response.jsonBody.businesses;
        businesses.forEach(function(business) {
            //always start off with numberGoing at zero one less thing to check if bar is not occupied by a user
            business.numberGoing = 0;
            savedBars.forEach(function(bar) {
                if(bar.alias === business.alias) {
                    business.numberGoing = bar.numberGoing;
                }
            })
        })
        res.send({data: businesses});
    })
    .catch(function(e) {
        res.send({err: e});
    })
}
exports.handleUser = function(req, res, next) {
    const barAlias = req.body.barAlias;
    const userId = req.body.userId;
    Bar.findOne({alias: barAlias})
        .then((bar) => {
            if(!bar) {
                const newBar = new Bar({
                    alias: barAlias
                })
                newBar.usersGoing.push(userId);
                newBar.numberGoing = newBar.usersGoing.length;
                newBar.save();
                res.send({data: newBar});
            }
            //grab the index of the user if they are in the usersGoing array
            const indexOfUserId = bar.usersGoing.indexOf(userId);
            if(indexOfUserId > -1) {
                //if the user is already going, remove them from the bar
                const usersGoingMinusOne = bar.usersGoing.filter(function(bar, i) {
                    if(i !== indexOfUserId) {
                        return bar;
                    }
                })
                bar.numberGoing = usersGoingMinusOne.length;
                bar.usersGoing = usersGoingMinusOne;
                bar.save();
                res.send({data: bar});
            }
            else {
                bar.usersGoing.push(userId);
                bar.numberGoing = bar.usersGoing.length;
                bar.save();
                res.send({data: bar});
            } 
    })
    .catch(function(e) {
        res.send({err: e});
    })
}

exports.grabReview = function(req, res, next) {
    const barAlias = req.params.barAlias;
    client.reviews(barAlias).then(response => {
        const review = response.jsonBody.reviews[0].text;
        res.send({data: review, barAlias: barAlias});
      }).catch(e => {
        res.send({data: e});
      });
}