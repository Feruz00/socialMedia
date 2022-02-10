import moment from "moment";
import Moment from "react-moment";

const calculateTime = createdAt => {
  const gun1 = new Date( Date.now()).getDate()
  const gun2 = new Date(createdAt).getDate()
  // const today = moment(Date.now());
  // const postDate = moment(createdAt);
  // const diffInHours = today.diff(postDate, "hours");

  // console.log( today, ' ', postDate, ' ', today.diff(postDate, 'days') )

  // console.log(diffInHours)
  if (gun1 - gun2 === 0) {
    return (
      <>
        Today <Moment format="hh:mm A">{createdAt}</Moment>
      </>
    );
  } else if (gun1 - gun2 === 1) {
    return (
      <>
        Yesterday <Moment format="hh:mm A">{createdAt}</Moment>
      </>
    );
  } else if (gun1 - gun2 > 1) {
    return <Moment format="DD/MM/YYYY hh:mm A">{createdAt}</Moment>;
  }
};

export default calculateTime;
