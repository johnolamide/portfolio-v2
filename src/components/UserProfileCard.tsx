import React from 'react';
import type { GitHubUser } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Link as LinkIcon, Users, GitFork, Star } from 'lucide-react';

interface UserProfileCardProps {
  user: GitHubUser;
  totalStars?: number;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  user,
  totalStars = 0,
}) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
      <CardHeader className="text-center pb-4">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24 border-4 border-purple-200 dark:border-purple-700">
            <AvatarImage src={user.avatar_url} alt={user.login} />
            <AvatarFallback className="text-2xl font-bold bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
              {user.name?.charAt(0) || user.login.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user.name || user.login}
            </h1>
            <p className="text-purple-600 dark:text-purple-400 font-medium">
              @{user.login}
            </p>
          </div>

          {user.bio && (
            <p className="text-gray-600 dark:text-gray-300 text-center max-w-md">
              {user.bio}
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Location and Website */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          {user.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{user.location}</span>
            </div>
          )}
          {user.blog && (
            <a
              href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <LinkIcon className="w-4 h-4" />
              <span>{user.blog.replace(/^https?:\/\//, '')}</span>
            </a>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-800">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(user.followers)}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
          </div>

          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-800">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(user.following)}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Following</p>
          </div>

          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-800">
            <div className="flex items-center justify-center gap-1 mb-1">
              <GitFork className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(user.public_repos)}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Repos</p>
          </div>

          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-800">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(totalStars)}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Stars</p>
          </div>
        </div>

        {/* Company and Hireable Status */}
        <div className="flex flex-wrap justify-center gap-2">
          {user.company && (
            <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
              {user.company}
            </Badge>
          )}
          {user.hireable && (
            <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
              Available for hire
            </Badge>
          )}
        </div>

        {/* Join Date */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Joined GitHub on {new Date(user.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </CardContent>
    </Card>
  );
};