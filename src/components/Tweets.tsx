import { useEffect, useState } from 'react'
import { getAllTweets, postTweet, toggleTweetLikeDisLike } from '../Service/TweetService';
import { dateAgo } from '../Service/Function';
import Loader from './Loader';
import { Tooltip } from '@mui/material';
import { toast } from 'react-toastify';


function Tweets() {

    const [tweets, setTweets] = useState([]);
  const [tweetContent, setTweetContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [user, setUser] = useState<any>(null);

  // FETCH ALL TWEETS
  const fetchAllTweets = async () => {
    try {
      setLoading(true);
      const allTweets = await getAllTweets();
      setTweets(allTweets.statusCode.data.tweets);
    } catch (error:any) {
      toast.error("Error fetching tweets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTweets();

    // FETCH USER DATA
    const userData = JSON.parse(localStorage.getItem("userInfo") || "{}");
    if (userData && userData.user) {
      setUser(userData.user);
      setToken(userData.accessToken);
    }
  }, []);

  // TOGGLE LIKE AND DISLIKE
  const handleLikeTweet = async (tweetId: string) => {
    if(!token){
      toast.error("Login to Like tweet")
      return;
    }
    try {
      const response = await toggleTweetLikeDisLike(tweetId, token);
      toast.success(response.message);
      fetchAllTweets();
    } catch (error:any) {
      toast.error("Error toggling like/dislike:", error);
    }
  };

  // POST TWEET
  const handlePostTweet = async () => {
    if (!tweetContent) {
      toast.error("Tweet content cannot be empty");
      return;
    }

    if(!token){
      toast.error('Login to Tweet');
      return;
    }

    try {
      await postTweet(tweetContent, token);
      toast.success("Tweet posted successfully!");
      setTweetContent("");
      fetchAllTweets(); 
    } catch (error) {
      toast.error("Failed to post tweet");
    }
  };


    return (
        <div className="p-3">
            {loading ? (
                <Loader />
            ) : (
                <>
                    {/* INPUT BOX FOR TWEET */}
                    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                        <div className="flex items-center">
                            <img
                                src={user?.coverImage || 'https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png'}
                                alt="User"
                                className="w-10 h-10 rounded-full"
                            />
                            <input
                                type="text"
                                placeholder="What is happening?!"
                                className="flex-grow ml-3 bg-gray-900 border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                                onChange={(e)=>setTweetContent(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end items-center mt-3">
                            <button className="bg-blue-500 text-white rounded-full px-4 py-1"
                            onClick={handlePostTweet}
                            >
                                Post
                            </button>
                        </div>
                    </div>

                    {/* ALL TWEETS DIVS */}
                    <div>
                        {tweets?.length > 0 ? (
                            tweets.map((tweet: any) => (
                                <div key={tweet._id} className="border p-4 rounded-lg  my-4">
                                    <div className="flex items-center">
                                        <img
                                            src={tweet.owner?.coverImage || 'defaultImageURL'} 
                                            alt="User"
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div className="ml-3">
                                            <h2 className=" font-bold">{tweet.owner?.username || 'Unknown User'}</h2>
                                            <p className="text-gray-400 text-sm">{dateAgo(tweet.createdAt)}</p>
                                        </div>
                                    </div>
                                    <p className=" mt-2">{tweet.content}</p>
                                    <div className="flex justify-between items-center mt-2 text-gray-400">
                                        <div className="flex items-center">
                                        <Tooltip title={token ? "Like Tweet" : "Login to Like Tweet"} arrow>
                                        <span className="cursor-pointer">
                                                <i
                                                className="fa-solid fa-thumbs-up"
                                                onClick={() => handleLikeTweet(tweet._id)}
                                                ></i>
                                            </span>
                                            </Tooltip>

                                            <Tooltip title={token ? "Dislike Tweet": "Login to Dislike tweet"} arrow>
                                                <span className="cursor-pointer ml-3">
                                                    <i className="fa-solid fa-thumbs-down"></i>
                                                </span>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400">No tweets available.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );


}

export default Tweets