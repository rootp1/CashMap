import { Users, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export function Community() {
  const communities = [
    {
      id: '1',
      name: 'College Freshers',
      description: 'First-year students sharing spending tips',
      members: 234,
      medianDaily: 68,
      avatar: '🎓',
    },
    {
      id: '2',
      name: 'Hostel Buddies',
      description: 'Hostel students optimizing meal budgets',
      members: 156,
      medianDaily: 45,
      avatar: '🏠',
    },
    {
      id: '3',
      name: 'Part-time Workers',
      description: 'Students balancing work and studies',
      members: 89,
      medianDaily: 85,
      avatar: '💼',
    },
  ];

  const userAvgDaily = 73; // Mock user data

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hidden">
        {/* Intro Card */}
        <Card className="bg-primary-muted border-primary">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Users className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Community Insights
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Compare spending as percentages; amounts are private. See how your habits 
              stack up against similar students.
            </p>
          </CardContent>
        </Card>

        {/* Communities List */}
        <div className="space-y-4">
          {communities.map((community) => {
            const delta = userAvgDaily - community.medianDaily;
            const isDeltaPositive = delta > 0;
            
            return (
              <Card key={community.id} className="border border-border">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="text-2xl">{community.avatar}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {community.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {community.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {community.members} members
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Median avg daily %:</span>
                      <span className="font-semibold text-foreground">
                        {community.medianDaily}%
                      </span>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        // Mock detail view
                        console.log('View community details');
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Mock Detail View for First Community */}
        <Card className="border border-border">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-4">
              Your vs College Freshers
            </h3>
            
            <div className="space-y-4">
              {/* User Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Your avg daily %</span>
                  <span className="text-sm font-semibold text-foreground">{userAvgDaily}%</span>
                </div>
                <Progress value={Math.min(userAvgDaily, 120)} className="h-3" />
              </div>
              
              {/* Community Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Community median %</span>
                  <span className="text-sm font-semibold text-foreground">{communities[0].medianDaily}%</span>
                </div>
                <Progress value={Math.min(communities[0].medianDaily, 120)} className="h-3" />
              </div>
              
              {/* Delta */}
              <div className="flex items-center justify-center space-x-2 pt-2">
                {userAvgDaily > communities[0].medianDaily ? (
                  <TrendingUp className="h-4 w-4 text-danger" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-success" />
                )}
                <span className={`text-sm font-medium ${
                  userAvgDaily > communities[0].medianDaily ? 'text-danger' : 'text-success'
                }`}>
                  {Math.abs(userAvgDaily - communities[0].medianDaily)} pp {
                    userAvgDaily > communities[0].medianDaily ? 'above' : 'below'
                  } community median
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}