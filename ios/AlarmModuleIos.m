//
//  AlarmModuleIos.m
//  App911Interpreters
//
//  Created by MAC OS on 10/18/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "AlarmModuleIos.h"

// define macro
#define SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(v)  ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] != NSOrderedAscending)
#define SYSTEM_VERSION_LESS_THAN(v)                 ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] == NSOrderedAscending)

@implementation AlarmModuleIos

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(addEvent:(NSString *)name location:(NSString *)location)
{
  RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
  
}

RCT_EXPORT_METHOD(createAlarmIOS:(NSInteger)hour munite:(NSInteger)munite year:(NSInteger)year month:(NSInteger) month day:(NSInteger)day  key:(NSString *) keyindentify title:(NSString*)title content:(NSString*) body)
{
  
  NSDateComponents *date = [[NSDateComponents alloc]init];
  date.hour = hour;
  date.minute = munite;
  date.year = year;
  date.month = month,
  date.day = day;
  
  
  
  NSLog(@"date1 %@",date);
  [date setTimeZone:[NSTimeZone defaultTimeZone]];
  
  if(SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(@"10.0")){
    UNMutableNotificationContent *content = [[UNMutableNotificationContent alloc]init];
    content.title = [NSString localizedUserNotificationStringForKey:title arguments:nil];
    content.body = [NSString localizedUserNotificationStringForKey:body arguments:nil];
    content.sound = [UNNotificationSound defaultSound];
    
    
    
    
    UNCalendarNotificationTrigger *trigger = [UNCalendarNotificationTrigger triggerWithDateMatchingComponents:date repeats:NO];
    UNNotificationRequest *request = [UNNotificationRequest requestWithIdentifier:keyindentify content:content trigger:trigger];
    
    UNUserNotificationCenter* center = [UNUserNotificationCenter currentNotificationCenter];
    center.delegate = self;
    [center addNotificationRequest:request withCompletionHandler:^(NSError * _Nullable error) {
      if (error != nil) {
        NSLog(@"push--error%@", error.localizedDescription);
      }
    }];
  }else{
    UILocalNotification *localNotif = [[UILocalNotification alloc] init];
    NSCalendar *calander = [NSCalendar currentCalendar];
    NSDate *newDate = [calander dateFromComponents:date];
    localNotif.fireDate = newDate;
    NSLog(@"new dataaaa %@",newDate);
    localNotif.alertBody = body;
    localNotif.alertTitle = title;
    localNotif.applicationIconBadgeNumber = 1;
    localNotif.soundName = UILocalNotificationDefaultSoundName;
    [[UIApplication sharedApplication] scheduleLocalNotification:localNotif];
  }
  
  
}

-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler{
  NSLog(@"User Info will : %@",notification.request.content.userInfo);
  completionHandler(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge);
}

-(void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler{
  NSLog(@"User Info did: %@",response.notification.request.content.userInfo);
  completionHandler();
}




@end
