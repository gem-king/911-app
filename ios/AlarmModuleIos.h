//
//  AlarmModuleIos.h
//  App911Interpreters
//
//  Created by MAC OS on 10/18/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <UserNotifications/UserNotifications.h>
#import <React/RCTLog.h>
@interface AlarmModuleIos : NSObject<RCTBridgeModule,UNUserNotificationCenterDelegate>

@end
