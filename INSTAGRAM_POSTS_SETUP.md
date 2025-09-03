# Instagram Posts Integration

This document explains how to use the new Instagram posts functionality that integrates with the Facebook Graph API's `business_discovery` endpoint.

## API Endpoint

The new Instagram posts API endpoint is located at:
```
/api/data/instagram/business-posts
```

### Parameters
- `accountId` (required): The Instagram Business Account ID
- `username` (required): The Instagram username to fetch posts for

### Example Usage
```javascript
// Fetch Instagram posts for a specific account and username
const response = await fetch('/api/data/instagram/business-posts?accountId=123456789&username=your_instagram_username');
const data = await response.json();
```

## Facebook Graph API Integration

The endpoint uses the Facebook Graph API's `business_discovery` feature:

```
https://graph.facebook.com/v19.0/{accountID}?fields=business_discovery.username({username}){media{caption,id,media_type,media_url,timestamp,like_count,comments_count}}&access_token={accesstoken}
```

### Features
- Fetches recent media posts from any public Instagram account
- Includes post captions, media URLs, timestamps, and engagement metrics
- Transforms data to match the existing PostsTable format
- Provides account information including profile picture and follower count

## Redux Integration

### Actions
- `fetchInstagramPosts({ accountId, username })`: Fetch posts for a specific account
- `clearInstagramPosts()`: Clear posts data
- `setInstagramPosts(data)`: Set posts data manually

### Selectors
- `selectInstagramPosts(state)`: Get Instagram posts data
- `selectInstagramPostsStatus(state)`: Get loading status
- `selectInstagramPostsError(state)`: Get error information

### Example Usage in Component
```javascript
import { useAppDispatch } from "@/toolkit/hooks";
import { useSelector } from "react-redux";
import { 
  fetchInstagramPosts, 
  selectInstagramPosts, 
  selectInstagramPostsStatus 
} from "@/toolkit/instagramData/reducer";

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const instagramPosts = useSelector(selectInstagramPosts);
  const instagramPostsStatus = useSelector(selectInstagramPostsStatus);

  const handleFetchPosts = async () => {
    try {
      await dispatch(fetchInstagramPosts({
        accountId: 'your_account_id',
        username: 'target_username'
      })).unwrap();
    } catch (error) {
      console.error('Failed to fetch Instagram posts:', error);
    }
  };

  return (
    <div>
      <button onClick={handleFetchPosts}>Fetch Instagram Posts</button>
      {instagramPostsStatus === 'loading' && <p>Loading...</p>}
      {instagramPosts && (
        <div>
          <h3>{instagramPosts.pageInfo.name}</h3>
          <p>Posts: {instagramPosts.total}</p>
        </div>
      )}
    </div>
  );
};
```

## PostsTable Integration

The PostsTable component now supports Instagram posts with the following features:

### Platform Support
- Added Instagram icon support
- Instagram posts are displayed in the same format as Facebook posts
- Includes engagement metrics (likes, comments, shares)

### Data Structure
Instagram posts are transformed to match the Facebook posts format:
```javascript
{
  id: string,
  message: string,
  created_time: string,
  media_type: string,
  media_url: string,
  insights: {
    post_impressions: string | number,
    comment: number,
    share: number,
    post_reactions_like_total: number,
    // ... other reaction types
  }
}
```

## Posts Component Integration

The Posts component now includes:
- Instagram posts table alongside Facebook posts
- Separate refresh buttons for Facebook and Instagram
- Expandable table functionality for Instagram posts

### Layout
- Row 1: Facebook posts (left) | Instagram posts (right)
- Row 2: Top posts (left) | Other tables (right)

## Setup Requirements

1. **Instagram Business Account**: The account must be a business account
2. **Facebook Page Connection**: The Instagram account must be connected to a Facebook page
3. **Access Token**: Valid Facebook access token with Instagram permissions
4. **Account ID**: The Instagram Business Account ID must be stored in the database

## Error Handling

The API includes comprehensive error handling:
- Missing parameters validation
- Authentication checks
- API response validation
- Fallback error messages

## Future Enhancements

Potential improvements:
- Caching mechanism for Instagram posts
- Real-time updates
- More detailed analytics
- Media type-specific handling (photos, videos, carousels)
- Story posts integration
