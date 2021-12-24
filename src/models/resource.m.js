const firebase = require('../../config/db.config');

class SongDAO
{
  async getAllSongs()
  {
    try
    {

      const snapshot = await firebase.collection('song').get();
      snapshot.forEach((doc) => {
        let createdAt=doc.data().createdAt;
        let dateInMillis = createdAt._seconds * 1000;
        var dateCreate= new Date(dateInMillis).toDateString() + ' at ' + new Date(dateInMillis).toLocaleTimeString();
        let updatedAt=doc.data().updatedAt;
        let dateInMillis2 = updatedAt._seconds * 1000;
        var dateUpdate= new Date(dateInMillis2).toDateString() + ' at ' + new Date(dateInMillis2).toLocaleTimeString();
        songGot= doc.data();
        songGot.createdAt=dateCreate;
        songGot.updateAt=dateUpdate;
        console.log(songGot);
      });
    }
    catch(err)
    {
      console.error(err);
    }

  }
}

module.exports = new SongDAO();
