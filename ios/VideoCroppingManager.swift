//
//  VideoCroppingManager.swift
//  ImageCroppingIOSNativeModule
//
//  Created by Nakul Kundaliya on 19/12/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

import Foundation
import AVFoundation
import UIKit

// VideoCroppingManager.swift

@objc(VideoCroppingManager)
class VideoCroppingManager: NSObject {
  @objc(addEvent:location:date:callback:)
  func addEvent(name: String, location: String, date: NSNumber, callback: RCTResponseSenderBlock) -> Void {
    // Date is ready to use!
    NSLog("Pretending to create an event %@ at %@", name, location);
    callback([name])
  }
  
  //// Static callback function
  //  @objc(cropVideo:callback:)
  //  func cropVideo(inputURL: NSURL,callback: RCTResponseSenderBlock) -> Void {
  //    // Date is ready to use!
  //    NSLog("Crop Video Pretending to create an event %@ at %@", inputURL);
  //    callback([inputURL])
  //  }
  
  @objc(cropVideo:callback:)
  func cropVideo(inputURL: NSString,callback: @escaping RCTResponseSenderBlock) -> Void {
    // Date is ready to use!
//    NSLog("Crop Video Pretending to create an event %@ at %@", inputURL);
    //callback([inputURL])
    let videoAsset: AVAsset = AVAsset( url: URL(string: inputURL as String)! )
    let clipVideoTrack = videoAsset.tracks( withMediaType: AVMediaType.video ).first! as AVAssetTrack
    
    let videoInstruction:AVMutableVideoCompositionLayerInstruction = videoCompositionInstructionForTrack(clipVideoTrack, asset: videoAsset)
    
    let squreSize = CGSize(width: 720, height: 720)
    let mainInstruction = AVMutableVideoCompositionInstruction()
    mainInstruction.timeRange = CMTimeRangeMake(kCMTimeZero, videoAsset.duration)
    mainInstruction.layerInstructions = [videoInstruction]
    
    let mainComposition = AVMutableVideoComposition()
    mainComposition.instructions = [mainInstruction]
    mainComposition.frameDuration = CMTimeMake(1, 30)
    mainComposition.renderSize = squreSize
    
    // Export
    let exportSession = AVAssetExportSession(asset: videoAsset, presetName: AVAssetExportPresetHighestQuality)!
    print ("random id = \(NSUUID().uuidString)")
    
    let croppedOutputFileUrl = URL( fileURLWithPath: getOutputPath( NSUUID().uuidString) ) // CREATE RANDOM FILE NAME HERE
    exportSession.outputURL = croppedOutputFileUrl
    exportSession.outputFileType = AVFileType.mov
    exportSession.videoComposition = mainComposition
    
    exportSession.exportAsynchronously {
      
      if exportSession.status == .completed {
        print("Export complete")
        DispatchQueue.main.async(execute: {
          //completion(croppedOutputFileUrl as NSURL)
          callback([croppedOutputFileUrl.absoluteString])
          
        })
        return
      } else if exportSession.status == .failed {
        print("Export failed - \(String(describing: exportSession.error))")
      }
      
      //completion(nil)
      callback(nil)
      return
    }
  }
  
  
  /// Create random string for crop file name
  ///
  /// - Parameter name: random string
  /// - Returns: document dir url
  fileprivate func getOutputPath( _ name: String ) -> String {
    let documentPath = NSSearchPathForDirectoriesInDomains(      .documentDirectory, .userDomainMask, true )[ 0 ] as NSString
    let outputPath = "\(documentPath)/\(name).mov"
    print(outputPath)
    return outputPath
  }
  
  
  /// Create composition layer for cropping video
  ///
  /// - Parameters:
  ///   - track: AVAssetTrack from video url
  ///   - asset: AVAsset from video url
  /// - Returns: Composition Layer Instruction
  fileprivate func videoCompositionInstructionForTrack(_ track: AVAssetTrack, asset: AVAsset) -> AVMutableVideoCompositionLayerInstruction {
    let instruction = AVMutableVideoCompositionLayerInstruction(assetTrack: track)
    
    let assetTrack = asset.tracks(withMediaType: AVMediaType.video)[0]
    
    let transform = assetTrack.preferredTransform
    var videoSize : CGSize = assetTrack.naturalSize
    
    if ((transform.a == 0 && transform.b == 1 && transform.c == -1 && transform.d == 0) // rotate 90
      || (transform.a == 0 && transform.b == -1 && transform.c == 1 && transform.d == 0)) { // rotate -90
      videoSize = CGSize(width: assetTrack.naturalSize.height, height: assetTrack.naturalSize.width)
    } else {
      videoSize = assetTrack.naturalSize
    }
    
    let square = fmin(videoSize.width,videoSize.height)
    let translate = CGAffineTransform(translationX: -(videoSize.width - square)/2, y: -(videoSize.height - square)/2)
    
    let final = transform.concatenating(translate)
    instruction.setTransform(final, at: kCMTimeZero)
    
    return instruction
  }
  
  
  ///// ============= Image cropping ============== //
  @objc(cropImage:callback:)
  func cropImage(inputURL: NSString, callback: @escaping RCTResponseSenderBlock) -> Void {
//    callback([inputURL]);
    
    do {
      let imageData = try Data(contentsOf: URL(string: inputURL as String)!)
      guard let testImage = UIImage(data: imageData) else {
        callback(nil)
        return
      }
      let side: CGFloat = min(testImage.size.width, testImage.size.height)
      let x: CGFloat = (testImage.size.width - side) / 2;
      let y: CGFloat = (testImage.size.height - side) / 2;
      let cropRect = CGRect(x: x, y: y, width: side, height: side)
      guard let orgCgImage = testImage.cgImage else {
        callback(nil)
        return
      }
      guard let croppedCGImage = orgCgImage.cropping(to: cropRect) else {
        callback(nil)
        return
      }
      let imageCropped = UIImage(cgImage: croppedCGImage)
      let documentsUrl: URL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
      let fileName = NSUUID().uuidString + ".jpg"
      let fileURL = documentsUrl.appendingPathComponent(fileName)
      if let imageData = UIImageJPEGRepresentation(imageCropped, 1.0) {
        try? imageData.write(to: fileURL, options: .atomic)
        //completion(fileURL as NSURL)
        callback([fileURL.absoluteString])
        return
      }
      callback(nil)
    } catch {
      print("Error loading image : \(error)")
      callback(nil)
    }
  }
}
