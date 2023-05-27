import { BladeDocument } from './document/bladeDocument';
import { PintTransformer } from './document/pintTransformer';
import * as fs from 'fs';
import { StringUtilities } from './utilities/stringUtilities';
import { formatBladeString, formatBladeStringWithPint } from './formatting/prettier/utils';
const { execSync } = require('child_process');

// Internal file used to debug the parser.
const input = `@extends('layouts.master')

@section('title', 'Notification')

@section('content')
<h1>Notification</h1>

@switch($notification->type)
@case('message')
<p>You have a new message from {{ $notification->from }}.</p>
@break

@case('alert')
<p>Alert: {{ $notification->message }}</p>
@break

@case('reminder')
<p>Reminder: {{ $notification->message }}</p>
@break

@default
<p>You have a new notification.</p>
@endswitch
@endsection`;


console.log(formatBladeStringWithPint(input));

//console.log(theRes, resultMapping);
debugger;



